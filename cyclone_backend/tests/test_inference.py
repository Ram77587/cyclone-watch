from types import SimpleNamespace
from datetime import datetime, timezone
import numpy as np
import pytest

from cyclone_predictor_inference import (
    wind_to_category,
    wind_to_t_number,
    predictor,
    run_detection_inference,
    run_classification_inference,
    run_prediction_pipeline,
    NUM_SCALER_MEAN,
    NUM_SCALER_SCALE,
    Y_SCALER_MEAN,
    Y_SCALER_SCALE
)


def test_scaler_constants_validity():
    assert NUM_SCALER_MEAN.shape == (4,)
    assert NUM_SCALER_SCALE.shape == (4,)
    assert Y_SCALER_MEAN.shape == (4,)
    assert Y_SCALER_SCALE.shape == (4,)
    assert np.all(NUM_SCALER_SCALE > 0)
    assert np.all(Y_SCALER_SCALE > 0)


def test_wind_to_category():
    assert wind_to_category(40.0)[0] == "D"
    assert wind_to_category(55.0)[0] == "DD"
    assert wind_to_category(75.0)[0] == "CS"
    assert wind_to_category(100.0)[0] == "SCS"
    assert wind_to_category(140.0)[0] == "VSCS"
    assert wind_to_category(180.0)[0] == "ESCS"
    assert wind_to_category(230.0)[0] == "SuCS"


def test_wind_to_t_number():
    assert wind_to_t_number(40.0) == "T1.0"
    assert wind_to_t_number(140.0) == "T4.0"
    assert wind_to_t_number(165.0) == "T4.5"
    assert wind_to_t_number(260.0) == "T6.5"


def test_predictor_forward_pass():
    # 3 time steps of [lat, lon, wind, pressure]
    history = np.array([
        [15.2, 87.4, 110.0, 985.0],
        [16.0, 86.5, 135.0, 975.0],
        [16.9, 85.6, 150.0, 965.0],
    ], dtype=np.float32)

    pred = predictor.predict_next_step(history)
    assert pred.shape == (4,)
    assert not np.isnan(pred).any()
    assert not np.isinf(pred).any()
    # Predicted coordinates should be physically realistic for North Indian Ocean
    assert 5.0 <= pred[0] <= 35.0
    assert 50.0 <= pred[1] <= 100.0


def test_detection_and_classification():
    cyclone = SimpleNamespace(id="BOB-01-2026", max_wind_kmph=165.0, min_pressure_hpa=955.0, basin="Bay of Bengal")
    obs = [SimpleNamespace(latitude=17.8, longitude=84.8, wind_kmph=165.0, pressure_hpa=955.0, timestamp_utc=datetime.now(timezone.utc))]

    det = run_detection_inference(cyclone, obs)
    assert det["confidence"] > 0.8
    assert "Well Defined" in det["eyeStatus"]
    assert "Identifier_model.pth" in det["model"]

    clf = run_classification_inference(cyclone, obs)
    assert clf["confidence"] >= 0.8
    assert clf["classifiedCategory"] == "VSCS"
    assert clf["estimatedTNo"] == "T4.5"


def test_prediction_pipeline_multi_horizon():
    cyclone = SimpleNamespace(id="BOB-01-2026", max_wind_kmph=165.0, min_pressure_hpa=955.0, basin="Bay of Bengal")
    obs = [
        SimpleNamespace(latitude=15.2, longitude=87.4, wind_kmph=110.0, pressure_hpa=985.0, timestamp_utc=datetime.now(timezone.utc)),
        SimpleNamespace(latitude=16.0, longitude=86.5, wind_kmph=135.0, pressure_hpa=975.0, timestamp_utc=datetime.now(timezone.utc)),
        SimpleNamespace(latitude=16.9, longitude=85.6, wind_kmph=150.0, pressure_hpa=965.0, timestamp_utc=datetime.now(timezone.utc)),
        SimpleNamespace(latitude=17.8, longitude=84.8, wind_kmph=165.0, pressure_hpa=955.0, timestamp_utc=datetime.now(timezone.utc)),
    ]

    res = run_prediction_pipeline(cyclone, obs)
    assert "forecastTimeline" in res
    assert len(res["forecastTimeline"]) == 5  # +6h, +12h, +24h, +48h, +72h

    horizons = [f["leadHorizonHrs"] for f in res["forecastTimeline"]]
    assert horizons == [6, 12, 24, 48, 72]

    # Monotonically increasing cone of uncertainty
    cones = [f["coneRadiusKm"] for f in res["forecastTimeline"]]
    assert all(cones[i] < cones[i+1] for i in range(len(cones)-1))

    # Landfall projection
    assert res["landfall"] is not None
    assert res["landfall"]["isLandfallExpected"] is True
    assert "location" in res["landfall"]
    assert len(res["landfall"]["coordinates"]) == 2
