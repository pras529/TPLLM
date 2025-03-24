import requests

BASE_URL = "http://localhost:5000"


def test_health():
    r = requests.get(f"{BASE_URL}/health")
    print("Health Check:", r.json())


def test_predict():
    data = {
        "location": "Chennai",
        "time": "2025-03-24T09:00:00Z"
    }
    r = requests.post(f"{BASE_URL}/predict", json=data)
    print("Prediction Response:", r.json())


def test_retrain():
    r = requests.post(f"{BASE_URL}/retrain")
    print("Retrain Trigger:", r.json())


if __name__ == "__main__":
    test_health()
    test_predict()
    test_retrain()
