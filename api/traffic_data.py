from pymongo import MongoClient
from datetime import datetime, timedelta, UTC
import random

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
print(client.list_database_names())
db = client.tpllm
collection = db.traffic_data

# Sample options
locations = [
    {"lat": 13.08, "lon": 80.27},  # Chennai
    {"lat": 12.97, "lon": 77.59},  # Bangalore
    {"lat": 19.07, "lon": 72.87},  # Mumbai
    {"lat": 28.61, "lon": 77.20},  # Delhi
    {"lat": 22.57, "lon": 88.36},  # Kolkata
]

weather_conditions = ["clear", "rain", "fog", "storm", "drizzle"]
road_types = ["highway", "main road", "service road", "residential", "rural road"]
congestion_levels = ["low", "moderate", "high", "severe"]

# Function to insert a single document
def insert_data(data):
    collection.insert_one(data)

# Function to fetch all documents
def fetch_training_data():
    cursor = collection.find({})
    return list(cursor)

# Function to generate a random sample
def generate_sample():
    location = random.choice(locations)
    return {
        "timestamp": datetime.now(UTC) + timedelta(minutes=random.randint(-10000, 10000)),
        "location": location,
        "speed_ratio": round(random.uniform(0.2, 1.0), 2),  # 0.2 to 1.0
        "congestion_level": random.choice(congestion_levels),
        "weather": random.choice(weather_conditions),
        "road_type": random.choice(road_types)
    }

# Insert 200 samples
def insert_bulk_samples(n=200):
    samples = [generate_sample() for _ in range(n)]
    collection.insert_many(samples)
    print(f"Inserted {n} sample documents successfully.")

# Example Insert (Single)
# insert_data({
#     "timestamp": datetime.now(UTC),
#     "location": {"lat": 13.08, "lon": 80.27},
#     "speed_ratio": 0.7,
#     "congestion_level": "high",
#     "weather": "rain",
#     "road_type": "highway"
# })

# Bulk Insert
if __name__ == "__main__":
    insert_bulk_samples(200)
