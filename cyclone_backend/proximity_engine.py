"""
Coastal Proximity & Geofencing Early Warning Engine
Calculates spatial proximity, threat levels, estimated time of arrival (ETA),
and IMD/NDRF compliant actionable directives for coastal districts and custom GPS coordinates.
"""

from math import radians, sin, cos, sqrt, atan2, degrees
from datetime import datetime, timezone, timedelta
from typing import Any, Optional
from coastal_data import COASTAL_DISTRICTS


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the great-circle distance between two points on the Earth in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return round(R * c, 1)


def calculate_bearing_deg(lat1: float, lon1: float, lat2: float, lon2: float) -> int:
    """Calculates initial bearing from point 1 to point 2 in degrees (0 - 360)."""
    l1, l2 = radians(lat1), radians(lat2)
    dl = radians(lon2 - lon1)
    x = sin(dl) * cos(l2)
    y = cos(l1) * sin(l2) - sin(l1) * cos(l2) * cos(dl)
    initial_bearing = degrees(atan2(x, y))
    return round((initial_bearing + 360) % 360)


def get_hazard_tier(distance_km: float, is_near_landfall: bool, current_wind_kmph: float) -> dict[str, Any]:
    """
    Categorizes the hazard tier based on IMD 4-stage cyclone warning framework:
    - RED (Warning / Evacuation): <= 80 km or direct landfall path
    - ORANGE (Alert / Preparedness): 80 - 180 km
    - YELLOW (Watch / Advisory): 180 - 300 km
    - GREEN (Monitoring / Safe): > 300 km
    """
    if distance_km <= 80 or (is_near_landfall and distance_km <= 120):
        return {
            "tier": "RED",
            "label": "Severe Warning (Evacuation Order)",
            "severity": "severe",
            "colorHex": "#ef4444",
            "bgClass": "bg-rose-500/15 border-rose-500/40 text-rose-300",
            "windRisk": f"Destructive winds ({round(current_wind_kmph * 0.85)}–{round(current_wind_kmph)} km/h)",
            "surgeRisk": "Storm surge 2.5–4.5m inundation threat",
            "directives": [
                "Mandatory evacuation of residents within 5 km of coastline.",
                "Total suspension of fishing operations, ports, and ferry links.",
                "Mobilize NDRF/SDRF battallions and activate relief shelters.",
                "Move vulnerable livestock to elevated concrete shelters.",
                "Secure tin roofs, loose antennas, and power backup generators."
            ]
        }
    elif distance_km <= 180:
        return {
            "tier": "ORANGE",
            "label": "High Alert (Preparedness)",
            "severity": "moderate",
            "colorHex": "#f97316",
            "bgClass": "bg-amber-500/15 border-amber-500/40 text-amber-300",
            "windRisk": f"Gale force winds ({round(current_wind_kmph * 0.6)}–{round(current_wind_kmph * 0.85)} km/h)",
            "surgeRisk": "Moderate tidal surge 1.0–2.0m above astronomical tide",
            "directives": [
                "Fishermen advised not to venture into deep sea; return to harbor immediately.",
                "Coastal district control rooms on 24x7 high alert.",
                "Clear urban drainage channels and inspect culverts for heavy rain.",
                "Keep emergency satellite phones and ham radio channels open.",
                "Civilians advised to stock 72-hour drinking water and non-perishables."
            ]
        }
    elif distance_km <= 300:
        return {
            "tier": "YELLOW",
            "label": "Cyclone Watch (Advisory)",
            "severity": "watch",
            "colorHex": "#eab308",
            "bgClass": "bg-yellow-500/15 border-yellow-500/40 text-yellow-300",
            "windRisk": f"Squally weather ({round(current_wind_kmph * 0.35)}–{round(current_wind_kmph * 0.6)} km/h)",
            "surgeRisk": "Rough sea conditions; breakers along shoreline",
            "directives": [
                "Continuous monitoring of IMD/RSMC 3-hourly synoptic bulletins.",
                "District emergency response teams placed on standby.",
                "Tourists and beachgoers restricted from coastal shorelines.",
                "Verify backup fuel for medical centers and telecom towers."
            ]
        }
    else:
        return {
            "tier": "GREEN",
            "label": "Monitoring (Safe Zone)",
            "severity": "safe",
            "colorHex": "#10b981",
            "bgClass": "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
            "windRisk": "Normal to breezy coastal conditions",
            "surgeRisk": "No significant surge anomaly",
            "directives": [
                "Standard routine monitoring.",
                "No immediate civilian precautionary action needed."
            ]
        }


def generate_sms_broadcast(district_name: str, storm_name: str, storm_cat: str, tier: str, distance_km: float, eta_hrs: float) -> str:
    """Generates an authentic IMD/NDRF compliant SMS text broadcast for disaster broadcast systems."""
    now_str = datetime.now(timezone.utc).strftime("%d-%b %H:%M UTC")
    if tier == "RED":
        return (
            f"[URGENT: DISASTER ALERT - NDRF/IMD]\n"
            f"Severe Warning: Cyclone {storm_name} ({storm_cat}) located {distance_km}km from {district_name}.\n"
            f"Closest approach in approx {max(1, int(eta_hrs))} hrs. Severe gale winds and storm surge expected.\n"
            f"ACTION: Immediate evacuation of low-lying coastal areas to designated cyclone shelters. Call 1077 for assistance. Issued {now_str}."
        )
    elif tier == "ORANGE":
        return (
            f"[CYCLONE ALERT - SDMA/IMD]\n"
            f"Alert: Cyclone {storm_name} ({storm_cat}) approaching {district_name}, approx {distance_km}km offshore.\n"
            f"Estimated arrival in ~{max(1, int(eta_hrs))} hrs. Heavy rainfall & strong gales predicted.\n"
            f"ACTION: Fishermen stay off sea. Secure loose property and keep emergency kit ready. Dial 1077. Issued {now_str}."
        )
    else:
        return (
            f"[WEATHER ADVISORY - IMD]\n"
            f"Watch: Cyclone {storm_name} currently {distance_km}km from {district_name}. Sea rough.\n"
            f"Stay tuned to local radio & official bulletins. Dial 1077 for queries. Issued {now_str}."
        )


def evaluate_coastal_districts(storm: dict[str, Any]) -> dict[str, Any]:
    """
    Evaluates all coastal districts against the active storm position, forward speed, and predicted track.
    Returns grouped rankings: Red, Orange, Yellow, and Green zones.
    """
    cur_pos = storm.get("currentPosition", {})
    eye_lat = cur_pos.get("lat", 20.0)
    eye_lng = cur_pos.get("lng", 88.0)
    wind_kmph = storm.get("currentWindKmph", 85.0)
    storm_name = storm.get("name", "Active Cyclone")
    storm_cat = storm.get("currentCategory", "CS")
    fwd_speed = storm.get("movement", {}).get("speedKmph") or 18.0
    if fwd_speed <= 3.0:
        fwd_speed = 15.0  # Baseline sensible forward speed for ETA calculation

    landfall = storm.get("landfall") or {}
    lf_coords = landfall.get("coordinates") if landfall.get("isLandfallExpected") else None

    # Predicted track points for cross-track proximity
    pred_track = storm.get("predictedTrack", [])

    assessed_districts = []

    for d in COASTAL_DISTRICTS:
        dist_eye = haversine_distance_km(d["lat"], d["lng"], eye_lat, eye_lng)

        # Distance to projected landfall
        dist_landfall = None
        is_near_landfall = False
        if lf_coords and len(lf_coords) == 2:
            dist_landfall = haversine_distance_km(d["lat"], d["lng"], lf_coords[0], lf_coords[1])
            if dist_landfall <= 90:
                is_near_landfall = True

        # Check closest distance to any predicted track point
        min_track_dist = dist_eye
        for pt in pred_track:
            td = haversine_distance_km(d["lat"], d["lng"], pt["lat"], pt["lng"])
            if td < min_track_dist:
                min_track_dist = td

        # Effective distance considers current eye and closest predicted approach
        effective_distance = min(dist_eye, min_track_dist)

        hazard = get_hazard_tier(effective_distance, is_near_landfall, wind_kmph)
        eta_hrs = max(0.5, round(dist_eye / fwd_speed, 1))

        bearing = calculate_bearing_deg(eye_lat, eye_lng, d["lat"], d["lng"])
        sms = generate_sms_broadcast(d["name"], storm_name, storm_cat, hazard["tier"], dist_eye, eta_hrs)

        assessed_districts.append({
            "id": d["id"],
            "name": d["name"],
            "state": d["state"],
            "basin": d["basin"],
            "coastalZone": d["coastalZone"],
            "lat": d["lat"],
            "lng": d["lng"],
            "emergencyPhone": d["emergencyPhone"],
            "distanceToEyeKm": dist_eye,
            "distanceToLandfallKm": dist_landfall,
            "closestApproachKm": min_track_dist,
            "bearingDeg": bearing,
            "etaHours": eta_hrs,
            "hazardTier": hazard["tier"],
            "hazardLabel": hazard["label"],
            "severity": hazard["severity"],
            "colorHex": hazard["colorHex"],
            "bgClass": hazard["bgClass"],
            "windRisk": hazard["windRisk"],
            "surgeRisk": hazard["surgeRisk"],
            "directives": hazard["directives"],
            "smsAlertBroadcast": sms
        })

    # Sort by effective distance (most endangered first)
    assessed_districts.sort(key=lambda x: x["distanceToEyeKm"])

    red_districts = [d for d in assessed_districts if d["hazardTier"] == "RED"]
    orange_districts = [d for d in assessed_districts if d["hazardTier"] == "ORANGE"]
    yellow_districts = [d for d in assessed_districts if d["hazardTier"] == "YELLOW"]

    return {
        "stormId": storm.get("id"),
        "stormName": storm_name,
        "category": storm_cat,
        "stormCenter": {"lat": eye_lat, "lng": eye_lng},
        "forwardSpeedKmph": fwd_speed,
        "totalDistrictsMonitored": len(assessed_districts),
        "summary": {
            "redZoneCount": len(red_districts),
            "orangeZoneCount": len(orange_districts),
            "yellowZoneCount": len(yellow_districts)
        },
        "districts": assessed_districts,
        "highRiskDistricts": red_districts + orange_districts
    }


def evaluate_custom_coordinate(lat: float, lng: float, storm: dict[str, Any], location_label: Optional[str] = None) -> dict[str, Any]:
    """Calculates hazard tier and emergency directives for any custom GPS coordinates (e.g. user device)."""
    cur_pos = storm.get("currentPosition", {})
    eye_lat = cur_pos.get("lat", 20.0)
    eye_lng = cur_pos.get("lng", 88.0)
    wind_kmph = storm.get("currentWindKmph", 85.0)
    storm_name = storm.get("name", "Active Cyclone")
    storm_cat = storm.get("currentCategory", "CS")
    fwd_speed = storm.get("movement", {}).get("speedKmph") or 18.0
    if fwd_speed <= 3.0:
        fwd_speed = 15.0

    dist_eye = haversine_distance_km(lat, lng, eye_lat, eye_lng)

    landfall = storm.get("landfall") or {}
    lf_coords = landfall.get("coordinates") if landfall.get("isLandfallExpected") else None
    dist_landfall = None
    is_near_landfall = False
    if lf_coords and len(lf_coords) == 2:
        dist_landfall = haversine_distance_km(lat, lng, lf_coords[0], lf_coords[1])
        if dist_landfall <= 90:
            is_near_landfall = True

    pred_track = storm.get("predictedTrack", [])
    min_track_dist = dist_eye
    for pt in pred_track:
        td = haversine_distance_km(lat, lng, pt["lat"], pt["lng"])
        if td < min_track_dist:
            min_track_dist = td

    effective_dist = min(dist_eye, min_track_dist)
    hazard = get_hazard_tier(effective_dist, is_near_landfall, wind_kmph)
    eta_hrs = max(0.5, round(dist_eye / fwd_speed, 1))
    bearing = calculate_bearing_deg(eye_lat, eye_lng, lat, lng)
    label = location_label or f"Location ({lat:.3f}°N, {lng:.3f}°E)"

    sms = generate_sms_broadcast(label, storm_name, storm_cat, hazard["tier"], dist_eye, eta_hrs)

    return {
        "locationLabel": label,
        "coordinates": [lat, lng],
        "distanceToEyeKm": dist_eye,
        "distanceToLandfallKm": dist_landfall,
        "closestApproachKm": min_track_dist,
        "bearingFromEyeDeg": bearing,
        "etaHours": eta_hrs,
        "hazardTier": hazard["tier"],
        "hazardLabel": hazard["label"],
        "severity": hazard["severity"],
        "colorHex": hazard["colorHex"],
        "bgClass": hazard["bgClass"],
        "windRisk": hazard["windRisk"],
        "surgeRisk": hazard["surgeRisk"],
        "directives": hazard["directives"],
        "smsAlertBroadcast": sms
    }
