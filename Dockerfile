FROM tensorflow/tensorflow:2.15.0-gpu
WORKDIR /app
COPY api/ /app/
RUN python -m pip install --upgrade pip
RUN pip install blinker --ignore-installed
RUN pip install --break-system-packages -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]
