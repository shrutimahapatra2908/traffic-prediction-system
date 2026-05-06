import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 📂 Load dataset
df = pd.read_csv("traffic.csv")

# 🕒 Convert datetime to features
df["date_time"] = pd.to_datetime(df["date_time"])
df["hour"] = df["date_time"].dt.hour
df["day"] = df["date_time"].dt.dayofweek

# 🌦️ Convert weather to numeric
df["weather_main"] = df["weather_main"].astype("category").cat.codes

# 🚦 Create traffic labels
def classify_traffic(volume):
    if volume < 1000:
        return 0   # Low
    elif volume < 3000:
        return 1   # Medium
    else:
        return 2   # High

df["traffic"] = df["traffic_volume"].apply(classify_traffic)

# 🎯 Features & Target
X = df[["hour", "day", "weather_main"]]
y = df["traffic"]

# 🔀 Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 🌲 Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# 📊 Evaluate model
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)

print("Accuracy:", acc)

# 💾 Save BOTH model + accuracy
joblib.dump({
    "model": model,
    "accuracy": acc
}, "traffic_model.pkl")

print(" Model + accuracy saved successfully!")

# 🔍 Verify saved file (important)
data = joblib.load("traffic_model.pkl")
print("Saved file type:", type(data))












































