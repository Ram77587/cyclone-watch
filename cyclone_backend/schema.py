from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel

class CurrentPosition(BaseModel):
    lat: float
    lng: float
    timestamp: Optional[datetime] = None

class TrackPointResponse(BaseModel):
    lat: float
    lng: float
    windKmph: Optional[float] = None
    pressureHpa: Optional[float] = None
    time: datetime
    radiusKm: Optional[float] = None

class CycloneResponse(BaseModel):
    id: str
    name: str
    year: int
    basin: str
    status: str
    currentCategory: str
    categoryName: str
    currentPosition: CurrentPosition
    currentWindKmph: float
    maxSustainedWindKmph: float
    currentPressureHpa: Optional[float] = None
    minPressureHpa: Optional[float] = None
    movement: dict[str, Any]
    observedTrack: list[TrackPointResponse]
    predictedTrack: list[TrackPointResponse]
    forecastTimeline: list[dict[str, Any]]
    landfall: Optional[dict[str, Any]] = None
    aiTelemetry: dict[str, Any]

class Alert(BaseModel):
    id: str
    region: str
    message: str
    severity: str
    issuedAt: datetime
