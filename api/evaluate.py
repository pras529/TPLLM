from transformers import pipeline
from api.traffic_data import fetch_training_data

# Initialize text-generation pipeline with GPT-2 for testing
pipe = pipeline("text-generation", model="gpt2", framework="pt")

# Fetch training/evaluation data
data = fetch_training_data()

# Prepare input sequences from your dataset
sequences = [
    f"Traffic at {d['location']} is {d['congestion_level']} with speed ratio {d['speed_ratio']} and weather {d['weather']}."
    for d in data
]

# Run predictions
print("Model Evaluation Started...\n")
for i, seq in enumerate(sequences[:3]):  # Limiting to 3 samples for display
    result = pipe(seq, max_length=50, num_return_sequences=1)
    print(f"Sample {i+1} Prediction:\n{result[0]['generated_text']}\n")

print("✅ Model Evaluation Complete.")
