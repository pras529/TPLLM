from flask_cors import CORS  # ✅ Import CORS
from flask import Flask, request, jsonify
from transformers import pipeline
from traffic_data import fetch_training_data
from metrices import monitor_requests, metrics
import os

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Load Pipeline (GPT-2 for now, replace with Mistral once access is approved)
text_gen = pipeline("text-generation", model="gpt2")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Optional: Pull real-time data from MongoDB
    traffic_data = fetch_training_data()
    if traffic_data:
        latest = traffic_data[-1]  # Get the latest traffic record
        prompt = f"Traffic at {latest['location']} is {latest['congestion_level']} with speed ratio {latest['speed_ratio']} and weather {latest['weather']}."
    else:
        # Fallback to user input if no data
        prompt = f"Predict traffic for {data['location']} at {data['time']}"

    prediction = text_gen(prompt, max_length=50, do_sample=True, truncation=True, pad_token_id=50256)
    return jsonify({"prediction": prediction[0]['generated_text']})

@app.route('/retrain', methods=['POST'])
def retrain():
    os.system('python train_tpllm.py')
    return jsonify({"status": "Retraining started!"})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "API is running!"})

@app.before_request
def before_request():
    monitor_requests(request.method, request.path)

@app.route('/metrics')
def metrics_endpoint():
    return metrics()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
