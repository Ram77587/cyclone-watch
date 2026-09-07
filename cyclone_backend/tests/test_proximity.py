import pytest
from fastapi.testclient import TestClient
from main import app
from proximity_engine import haversine_distance_km, get_hazard_tier, calculate_bearing_deg, evaluate_custom_coordinate

client = TestClient(app)


def test_haversine_distance():
    # Known distance: Mumbai (18.922, 72.834) to Alibag (18.515, 73.181) is approx 58-60 km
    dist = haversine_distance_km(18.922, 72.834, 18.515, 73.181)
    assert 55.0 <= dist <= 65.0


def test_hazard_tier_assignment():
    # <= 80 km should be RED
    red = get_hazard_tier(50.0, is_near_landfall=False, current_wind_kmph=100.0)
    assert red["tier"] == "RED"
    assert "Evacuation" in red["label"]

    # 80-180 km should be ORANGE
    orange = get_hazard_tier(120.0, is_near_landfall=False, current_wind_kmph=100.0)
    assert orange["tier"] == "ORANGE"
    assert "High Alert" in orange["label"]

    # 180-300 km should be YELLOW
    yellow = get_hazard_tier(220.0, is_near_landfall=False, current_wind_kmph=100.0)
    assert yellow["tier"] == "YELLOW"

    # > 300 km should be GREEN
    green = get_hazard_tier(350.0, is_near_landfall=False, current_wind_kmph=100.0)
    assert green["tier"] == "GREEN"


def test_coastal_districts_endpoint():
    res = client.get("/coastal-districts")
    assert res.status_code == 200
    districts = res.json()
    assert len(districts) >= 30
    assert any(d["name"] == "Porbandar" for d in districts)
    assert any(d["name"] == "Balasore" for d in districts)


def test_alerts_proximity_endpoint():
    res = client.get("/alerts/proximity")
    assert res.status_code == 200
    data = res.json()
    assert "districts" in data
    assert "summary" in data
    assert len(data["districts"]) > 0
    # First item should be the closest district
    first = data["districts"][0]
    assert "distanceToEyeKm" in first
    assert "hazardTier" in first
    assert "smsAlertBroadcast" in first


def test_check_location_endpoint():
    payload = {
        "lat": 21.642,
        "lng": 69.629,
        "locationName": "Porbandar Coast Guard Station"
    }
    res = client.post("/alerts/check-location", json=payload)
    assert res.status_code == 200
    result = res.json()
    assert result["locationLabel"] == "Porbandar Coast Guard Station"
    assert "hazardTier" in result
    assert "directives" in result
    assert len(result["directives"]) > 0
    assert "smsAlertBroadcast" in result
