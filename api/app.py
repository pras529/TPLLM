from datetime import datetime
import random

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    location = (payload.get("location") or "").strip()
    time_str = (payload.get("time") or "").strip()

    if not location or not time_str:
        return jsonify({"error": "location and time are required"}), 400

    return jsonify(make_prediction(location, time_str))


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
