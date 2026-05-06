from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # allow requests from frontend

# Load trained model
data = joblib.load("../ml-model/traffic_model.pkl")
model = data["model"]
MODEL_ACCURACY = data["accuracy"]
# Weather mapping (same as training)
weather_map = {
    "Clear": 0,
    "Clouds": 1,
    "Rain": 2,
    "Drizzle": 2,
    "Snow": 3,
    "Fog": 4,
    "Mist": 4
}

# Reverse mapping for output labels
labels = ["Low", "Medium", "High"]

@app.route("/")
def home():
    return "🚦 Traffic Prediction API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Extract inputs
        hour = int(data.get("hour", 0))
        vehicles = int(data.get("vehicle_count", 0))  # optional
        weather_str = data.get("weather", "Clear")

        # Convert weather to numeric
        weather = weather_map.get(weather_str, 0)

        # Default day (can be improved later)
        day = 1

        # Prepare input for model
        features = np.array([[hour, day, weather]])

        # Predict
        prediction = model.predict(features)[0]

        # Convert to label
        result = labels[prediction]

        return jsonify({
            "traffic": result,
            "accuracy": MODEL_ACCURACY
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)














