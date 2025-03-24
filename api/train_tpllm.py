import tensorflow as tf
from transformers import TFAutoModelForCausalLM, AutoTokenizer
from api.traffic_data import fetch_training_data
# Load Pre-trained LLaMA
model = TFAutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2", from_pt=True)
tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")

# Data Preprocessing
data = fetch_training_data()
sequences = [f"Traffic at {d['location']} is {d['congestion_level']} with speed ratio {d['speed_ratio']} and weather {d['weather']}." for d in data]
inputs = tokenizer(sequences, return_tensors="tf", padding=True, truncation=True)

# Training Configuration
optimizer = tf.keras.optimizers.Adam(learning_rate=3e-5)
checkpoint_path = "checkpoints/tpllm"
model_checkpoint = tf.train.Checkpoint(model=model)
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir="./logs")

# GPU Training
with tf.device('/GPU:0'):
    model.compile(optimizer=optimizer, loss=model.compute_loss)
    model.fit(inputs['input_ids'], inputs['input_ids'], epochs=2, callbacks=[tensorboard_callback])

model_checkpoint.save(file_prefix=checkpoint_path)
