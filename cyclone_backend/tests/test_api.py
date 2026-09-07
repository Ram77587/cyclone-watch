import pytest
from fastapi.testclient import TestClient
from main import app
from database import SessionLocal
from seed import CYCLONE_ID

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "cyclones" in data
    assert "inferenceEngine" in data


def test_cyclones_list():
    response = client.get("/cyclones")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_active_cyclone():
    response = client.get("/cyclones/active")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == CYCLONE_ID or len(data["id"]) > 0
    assert "currentPosition" in data
    assert "movement" in data
    assert "observedTrack" in data
    assert "forecastTimeline" in data
    assert "aiTelemetry" in data

    # Verify AI telemetry contains live model outputs
    ai = data["aiTelemetry"]
    assert "detection" in ai
    assert "classification" in ai
    assert "prediction" in ai
    assert ai["prediction"]["confidence"] > 0.5
    assert "cyclone_prediction_model.h5" in ai["prediction"]["model"]
    assert "Identifier_model.pth" in ai["detection"]["model"]
    assert "Classifier_model.pth" in ai["classification"]["model"]


def test_trigger_infer():
    # Test triggering real-time ML inference
    response = client.post(f"/cyclones/{CYCLONE_ID}/infer")
    assert response.status_code == 200
    data = response.json()
    assert len(data["predictedTrack"]) > 0
    assert len(data["forecastTimeline"]) == 5
    assert data["aiTelemetry"]["prediction"]["status"] == "Operational"


def test_data_sources():
    response = client.get("/data-sources")
    assert response.status_code == 200
    sources = response.json()
    assert len(sources) >= 3
    source_ids = [s["id"] for s in sources]
    assert "ibtracs" in source_ids
    assert "mosdac" in source_ids
    assert "rsmc" in source_ids


def test_satellite_frames():
    response = client.get("/satellite-frames")
    assert response.status_code == 200
    frames = response.json()
    assert len(frames) >= 2
    assert "sensor" in frames[0]
    assert "satellite" in frames[0]


def test_data_quality():
    response = client.get("/data-quality")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert data["summary"]["validityRate"] > 0


def test_alerts():
    response = client.get("/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert isinstance(alerts, list)


def test_sync_data_sources():
    response = client.post("/data-sources/sync")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "synchronized"
    assert data["details"]["ingestedStorms"] >= 3
