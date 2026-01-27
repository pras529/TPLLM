from datetime import datetime
import random

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjA2YzUwNTY2NTM1MDQxM2E5ODBhMjBlMTA2N2M1MzZmIiwiaCI6Im11cm11cjY0In0="


def make_prediction(location: str, time_str: str) -> dict:
    """Return a lightweight mock prediction for the UI."""
    try:
        parsed_time = datetime.strptime(time_str, "%Y-%m-%d %H:%M")
        hour = parsed_time.hour
    except (ValueError, TypeError):
        parsed_time = None
        hour = random.randint(0, 23)

    base = 0.2 if hour < 6 else 0.6 if hour < 10 else 0.5 if hour < 16 else 0.8 if hour < 20 else 0.4
    noise = random.uniform(-0.1, 0.1)
    score = max(0.05, min(0.95, base + noise))

    level = "low" if score < 0.3 else "moderate" if score < 0.6 else "high" if score < 0.8 else "severe"

    return {
        "location": location,
        "timestamp": parsed_time.isoformat() if parsed_time else None,
        "congestion_score": round(score, 2),
        "congestion_level": level,
        "advice": "Consider leaving earlier or choosing alternate routes" if level in {"high", "severe"} else "Conditions look manageable",
    }


def parse_latlon(value: str):
    try:
        lat, lon = [float(x) for x in value.split(",")]
        return lat, lon
    except Exception:
        return None


def fetch_route_from_ors(start: str, dest: str) -> dict:
    api_key = ORS_API_KEY or None
    if not api_key:
        raise ValueError("ORS_API_KEY is not set in app.py")

    start_pair = parse_latlon(start)
    dest_pair = parse_latlon(dest)
    if not start_pair or not dest_pair:
        raise ValueError("Invalid coordinates; use 'lat,lon'")

    # OpenRouteService expects lon,lat order
    start_lonlat = f"{start_pair[1]},{start_pair[0]}"
    dest_lonlat = f"{dest_pair[1]},{dest_pair[0]}"
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    params = {"start": start_lonlat, "end": dest_lonlat}
    headers = {"Authorization": api_key}

    resp = requests.get(url, params=params, headers=headers, timeout=10)
    if resp.status_code != 200:
        raise RuntimeError(f"ORS error {resp.status_code}: {resp.text}")

    data = resp.json()
    route = (data.get("features") or [{}])[0].get("properties", {}).get("summary", {})
    distance_km = round((route.get("distance", 0) / 1000), 1)
    duration_min = round((route.get("duration", 0) / 60))
    return {
        "provider": "openrouteservice",
        "distance_km": distance_km,
        "duration_min": duration_min,
        "raw": data,
    }


def fetch_geocode_from_ors(query: str, limit: int = 5):
    api_key = ORS_API_KEY or None
    if not api_key:
        raise ValueError("ORS_API_KEY is not set in app.py")

    url = "https://api.openrouteservice.org/geocode/autocomplete"
    params = {"text": query, "size": limit}
    headers = {"Authorization": api_key}

    resp = requests.get(url, params=params, headers=headers, timeout=10)
    if resp.status_code != 200:
        raise RuntimeError(f"ORS geocode error {resp.status_code}: {resp.text}")

    data = resp.json()
    results = []
    for feature in data.get("features", []):
        props = feature.get("properties", {})
        coords = feature.get("geometry", {}).get("coordinates", [])
        if len(coords) >= 2:
            results.append({
                "label": props.get("label") or props.get("name") or "",
                "lon": coords[0],
                "lat": coords[1],
            })
    return {"results": results}


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    location = (payload.get("location") or "").strip()
    time_str = (payload.get("time") or "").strip()

    if not location or not time_str:
        return jsonify({"error": "location and time are required"}), 400

    return jsonify(make_prediction(location, time_str))


@app.route("/route", methods=["GET"])
def route():
    start = (request.args.get("start") or "").strip()
    dest = (request.args.get("dest") or "").strip()

    if not start or not dest:
        return jsonify({"error": "start and dest are required as 'lat,lon'"}), 400

    try:
        payload = fetch_route_from_ors(start, dest)
        return jsonify(payload)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as exc:  # pragma: no cover - simple guard
        return jsonify({"error": f"route lookup failed: {exc}"}), 502


@app.route("/geocode", methods=["GET"])
def geocode():
    query = (request.args.get("q") or "").strip()
    limit = int(request.args.get("limit", 5))

    if not query:
        return jsonify({"error": "q is required"}), 400

    try:
        return jsonify(fetch_geocode_from_ors(query, limit))
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as exc:  # pragma: no cover - simple guard
        return jsonify({"error": f"geocode failed: {exc}"}), 502


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
