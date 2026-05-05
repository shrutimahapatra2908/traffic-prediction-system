import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "hour": 9,
    "vehicle_count": 80
}

response = requests.post(url, json=data)

print(response.json())