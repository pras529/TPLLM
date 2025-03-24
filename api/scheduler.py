import schedule
import time
import os

def retrain_model():
    print("Starting scheduled model retraining...")
    os.system('python train_tpllm.py')
    print("Retraining Complete!")

# Schedule retraining daily at midnight
schedule.every().day.at("00:00").do(retrain_model)

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(60)
