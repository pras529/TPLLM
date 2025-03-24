from pymongo import MongoClient
import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client.tpllm
collection = db.traffic_data


def insert_data(data):
    collection.insert_one(data)


def fetch_training_data():
    cursor = collection.find({})
    return list(cursor)


# Example Insert
insert_data({
    "timestamp": datetime.datetime.utcnow(),
    "location": {"lat": 13.08, "lon": 80.27},
    "speed_ratio": 0.7,
    "congestion_level": "high",
    "weather": "rain",
    "road_type": "highway"
})
