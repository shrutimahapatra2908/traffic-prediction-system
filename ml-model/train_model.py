import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Sample dataset (you can replace with real dataset)
data = {
    'hour': [8, 9, 10, 17, 18, 19],
    'vehicle_count': [50, 80, 40, 100, 120, 90],
    'traffic': ['Medium', 'High', 'Low', 'High', 'High', 'Medium']
}

df = pd.DataFrame(data)

# Convert labels to numbers
df['traffic'] = df['traffic'].map({'Low': 0, 'Medium': 1, 'High': 2})

X = df[['hour', 'vehicle_count']]
y = df['traffic']

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model
joblib.dump(model, 'traffic_model.pkl')

print("Model trained and saved!")