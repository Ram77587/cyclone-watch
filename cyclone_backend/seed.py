from datetime import datetime, timedelta, timezone
from database import SessionLocal
from models import Cyclone, TrackPoint, LandfallPrediction

db = SessionLocal()

CYCLONE_ID = "BOB-01-2026"
now = datetime.now(timezone.utc)

# Rerunnable development seed: replace this storm's generated records.
db.query(LandfallPrediction).filter(LandfallPrediction.cyclone_id == CYCLONE_ID).delete()
db.query(TrackPoint).filter(TrackPoint.cyclone_id == CYCLONE_ID).delete()
db.query(Cyclone).filter(Cyclone.id == CYCLONE_ID).delete()

# =========================================================
# 1. CYCLONE
# =========================================================

cyclone = Cyclone(
    id=CYCLONE_ID,
    name="ANANYA",
    year=2026,
    basin="Bay of Bengal",
    status="ACTIVE",
    current_category="VSCS",
    max_wind_kmph=165.0,
    min_pressure_hpa=955.0,
    primary_source="RSMC"
)
db.add(cyclone)

# =========================================================
# 2. OBSERVED TRACK POINTS (past, moving toward coast)
# =========================================================

observed_data = [
    # hours_ago, lat, lon, wind_kmph, pressure_hpa, category
    (18, 15.2, 87.4, 110.0, 985.0, "CS"),
    (12, 16.0, 86.5, 135.0, 975.0, "SCS"),
    (6,  16.9, 85.6, 150.0, 965.0, "VSCS"),
    (0,  17.8, 84.8, 165.0, 955.0, "VSCS"),
]

for hours_ago, lat, lon, wind, pressure, category in observed_data:
    point = TrackPoint(
        cyclone_id=CYCLONE_ID,
        point_type="OBSERVED",
        timestamp_utc=now - timedelta(hours=hours_ago),
        lead_horizon_hrs=None,
        latitude=lat,
        longitude=lon,
        wind_kmph=wind,
        pressure_hpa=pressure,
        category=category,
        cone_radius_km=None,
        source_agency="IMD"
    )
    db.add(point)

# =========================================================
# 3. PREDICTED TRACK POINTS (future, heading toward Odisha)
# =========================================================

predicted_data = [
    # lead_hrs, lat, lon, wind_kmph
    (6,  18.5, 84.1, 160.0),
    (12, 19.3, 83.5, 150.0),
    (24, 20.4, 82.9, 120.0),
    (48, 21.6, 82.5, 80.0),
]

for lead_hrs, lat, lon, wind in predicted_data:
    radius_km = 20 + 25 * (lead_hrs / 6)
    point = TrackPoint(
        cyclone_id=CYCLONE_ID,
        point_type="PREDICTED",
        timestamp_utc=now + timedelta(hours=lead_hrs),
        lead_horizon_hrs=lead_hrs,
        latitude=lat,
        longitude=lon,
        wind_kmph=wind,
        pressure_hpa=None,
        category=None,
        cone_radius_km=radius_km,
        source_agency="MODEL"
    )
    db.add(point)

# =========================================================
# 4. LANDFALL PREDICTION
# =========================================================

landfall = LandfallPrediction(
    cyclone_id=CYCLONE_ID,
    strike_location="Near Puri, Odisha",
    latitude=19.8,
    longitude=85.8,
    eta_utc=now + timedelta(hours=30),
    wind_at_landfall=110.0,
    category_at_landfall="SCS",
    confidence_rating=0.780,
    issued_at=now
)
db.add(landfall)

# =========================================================
# COMMIT
# =========================================================

db.commit()
db.close()

print("Seed data inserted successfully.")
