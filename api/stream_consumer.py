from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'traffic_stream',
    bootstrap_servers='localhost:9092',
    auto_offset_reset='latest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    print("Received:", message.value)
