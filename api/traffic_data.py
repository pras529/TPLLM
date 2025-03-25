from pymongo import MongoClient
from datetime import datetime, UTC

client = MongoClient('mongodb://localhost:27017/')
print(client.list_database_names())
db = client.tpllm
collection = db.traffic_data


def insert_data(data):
    collection.insert_one(data)


def fetch_training_data():
    cursor = collection.find({})
    return list(cursor)


# Example Insert
insert_data({
    "timestamp": datetime.now(UTC),
    "location": {"lat": 13.08, "lon": 80.27},
    "speed_ratio": 0.7,
    "congestion_level": "high",
    "weather": "rain",
    "road_type": "highway"
})
