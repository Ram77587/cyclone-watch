import pytest
from fastapi.testclient import TestClient
from main import app
from mosdac_connector import mask_credential, MOSDAC_STATE

client = TestClient(app)


def test_mask_credential():
    assert mask_credential("") == "Not Configured"
    assert mask_credential("abc") == "****"
    assert mask_credential("testuser") == "te***er"
    assert mask_credential("isro_researcher_2026") == "is***26"


def test_mosdac_status_endpoint():
    res = client.get("/mosdac/status")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "ftpHost" in data
    assert "supportedSatellites" in data
    assert any(s["name"] == "INSAT-3D" for s in data["supportedSatellites"])
    assert any(s["name"] == "INSAT-3DR" for s in data["supportedSatellites"])


def test_mosdac_configure_endpoint(monkeypatch):
    import os
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    orig_env = None
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            orig_env = f.read()

    try:
        # Empty credentials validation
        bad_res = client.post("/mosdac/configure", json={"username": "", "password": ""})
        assert bad_res.status_code == 400

        # Valid configure
        res = client.post("/mosdac/configure", json={"username": "isro_evaluator", "password": "SecretPassword123"})
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "is***or" in data["configuredUser"]
        # Status reflects configuration
        st = client.get("/mosdac/status").json()
        assert st["hasCredentials"] is True
        assert "is***or" in st["configuredUser"]
    finally:
        if orig_env is not None:
            with open(env_path, "w") as f:
                f.write(orig_env)
        # Reload credentials into MOSDAC_STATE
        from mosdac_connector import update_mosdac_credentials
        from dotenv import dotenv_values
        vals = dotenv_values(env_path)
        if vals.get("MOSDAC_USERNAME") and vals.get("MOSDAC_PASSWORD"):
            update_mosdac_credentials(vals["MOSDAC_USERNAME"], vals["MOSDAC_PASSWORD"])


def test_mosdac_test_handshake_endpoint():
    res = client.post("/mosdac/test-handshake", json={"username": "isro_evaluator", "password": "SecretPassword123"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["authenticated"] is True
    assert "responseTimeMs" in data
    assert "diagnostics" in data
    assert len(data["diagnostics"]) > 0


def test_mosdac_sync_endpoint():
    res = client.post("/mosdac/sync", json={"productType": "3D_IMG_L1C_ASIA_MER"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "ingestedFrame" in data
    frame = data["ingestedFrame"]
    assert frame["satellite"] == "INSAT-3D"
    assert "TIR-1" in frame["channel"]
    assert "MOSDAC" in frame["id"]
    assert "minBrightnessTempK" in frame
    assert frame["minBrightnessTempK"] > 170  # realistic Kelvin
    assert "stormCenter" in frame

    # Verify frame is accessible from standard satellite gallery endpoint
    cat_res = client.get("/satellite-frames")
    assert cat_res.status_code == 200
    cat = cat_res.json()
    assert any(f["id"] == frame["id"] for f in cat)
