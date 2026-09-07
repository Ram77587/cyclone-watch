from sqlalchemy import Column, String, SmallInteger, Numeric, TIMESTAMP, Integer, ForeignKey, text
from sqlalchemy.orm import declarative_base
from database import engine

Base = declarative_base()


# =========================================================
# CYCLONES TABLE
# Master storm metadata
# =========================================================

class Cyclone(Base):
    __tablename__ = "cyclones"

    id = Column(String(32), primary_key=True)          # e.g. "ARB-01-2026"
    name = Column(String(64), nullable=False)
    year = Column(SmallInteger, nullable=False)
    basin = Column(String(64), nullable=False)          # e.g. "Arabian Sea"
    status = Column(String(16), nullable=False)         # ACTIVE / DECAYED / DISSIPATED
    current_category = Column(String(8), nullable=False)  # D/DD/CS/SCS/VSCS/ESCS/SuCS
    max_wind_kmph = Column(Numeric(5, 1))
    min_pressure_hpa = Column(Numeric(6, 1))
    primary_source = Column(String(64), server_default="RSMC")
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))


# =========================================================
# TRACK_POINTS TABLE
# Observed and predicted storm fixes
# =========================================================

class TrackPoint(Base):
    __tablename__ = "track_points"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cyclone_id = Column(String(32), ForeignKey("cyclones.id"), nullable=False)
    point_type = Column(String(16), nullable=False)     # OBSERVED / PREDICTED
    timestamp_utc = Column(TIMESTAMP(timezone=True), nullable=False)
    lead_horizon_hrs = Column(SmallInteger)              # 0,6,12,24,48,72 — null for observed
    latitude = Column(Numeric(6, 3), nullable=False)
    longitude = Column(Numeric(6, 3), nullable=False)
    wind_kmph = Column(Numeric(5, 1))
    pressure_hpa = Column(Numeric(6, 1))
    category = Column(String(8))
    cone_radius_km = Column(Numeric(6, 1))
    source_agency = Column(String(64))


# =========================================================
# LANDFALL_PREDICTIONS TABLE
# Projected coastal impact
# =========================================================

class LandfallPrediction(Base):
    __tablename__ = "landfall_predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cyclone_id = Column(String(32), ForeignKey("cyclones.id"), nullable=False)
    strike_location = Column(String(128))
    latitude = Column(Numeric(6, 3))
    longitude = Column(Numeric(6, 3))
    eta_utc = Column(TIMESTAMP(timezone=True))
    wind_at_landfall = Column(Numeric(5, 1))
    category_at_landfall = Column(String(8))
    confidence_rating = Column(Numeric(4, 3))
    issued_at = Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"))


Base.metadata.create_all(bind=engine)
