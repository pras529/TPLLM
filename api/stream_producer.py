from kafka import KafkaProducer
import json

producer = KafkaProducer(bootstrap_servers='localhost:9092',
                         value_serializer=lambda v: json.dumps(v).encode('utf-8'))

traffic_data = {"location": "Chennai", "time": "2025-03-24T10:00:00Z"}
producer.send('traffic_stream', traffic_data)
producer.flush()
