from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)
# Load trained model
model = joblib.load('../ml-model/traffic_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    hour = data['hour']
    vehicle_count = data['vehicle_count']

    prediction = model.predict([[hour, vehicle_count]])

    levels = ['Low', 'Medium', 'High']
    result = levels[prediction[0]]

    return jsonify({'traffic': result})

if __name__ == '__main__':
    app.run(debug=True)