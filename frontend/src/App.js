import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker
} from "@react-google-maps/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function App() {
  const [hour, setHour] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState("");
  const [history, setHistory] = useState([]);
  const today = new Date().getDay();
  const API_URL = "http://127.0.0.1:5000/predict"; // change after deploy
  const WEATHER_API_KEY = "b480cd87fa721d39876f26095dfe1d17";

  const containerStyle = {
    width: "80%",
    height: "400px",
    margin: "auto"
  };

  const center = {
    lat: 21.1702,
    lng: 72.8311
  };

  //  Get weather
  const getWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Surat&appid=${WEATHER_API_KEY}`
      );
      const data = await res.json();
      setWeather(data.weather[0].main);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  //  Auto prediction every 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      if (hour && vehicles) {
        predictTraffic();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [hour, vehicles, weather]);

  //  Predict
  const predictTraffic = async () => {
    if (!hour || !vehicles) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(API_URL, {
        hour,
        vehicle_count: vehicles,
        weather,
        day: today
      });

      const traffic = res.data.traffic;
      setResult(traffic);

      setHistory((prev) => [
        ...prev,
        { hour, vehicles, result: traffic }
      ]);
    } catch (err) {
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  //  Chart data
  const chartData = {
    labels: history.map((h, i) => `#${i + 1}`),
    datasets: [
      {
        label: "Traffic Level",
        data: history.map((h) =>
          h.result === "High" ? 3 : h.result === "Medium" ? 2 : 1
        )
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6 text-center">

      <h1 className="text-4xl font-bold text-blue-700 mb-6">
         Traffic Prediction System
      </h1>

      {/*  MAP */}
      <LoadScript googleMapsApiKey="AIzaSyCvhzk0_maSlUVI2kPY8zuQgXX01Hm-EG8">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>

      {/*  INPUT CARD */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto space-y-4">

        <h2 className="text-xl font-semibold text-gray-700">
          Enter Traffic Details
        </h2>

        <input
          type="number"
          placeholder="Hour (0-23)"
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setHour(e.target.value)}
        />

        <input
          type="number"
          placeholder="Vehicle Count"
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setVehicles(e.target.value)}
        />

        <button
          onClick={predictTraffic}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Predicting..." : "Predict Traffic"}
        </button>

        {/*  WEATHER */}
        <p className="text-gray-600">
           Weather: <strong>{weather}</strong>
        </p>
      </div>

      {/*  RESULT */}
      {result && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md text-center max-w-md mx-auto">
          <h2
            className={`text-2xl font-bold ${
              result === "High"
                ? "text-red-500"
                : result === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            🚦 Traffic Level: {result}
          </h2>
        </div>
      )}

      {/*  CHART */}
      {history.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
          <h3 className="font-bold mb-4">Traffic Trend</h3>
          <Bar data={chartData} />
        </div>
      )}

      {/*  HISTORY */}
      {history.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md max-w-md mx-auto text-left">
          <h3 className="font-bold mb-2">History</h3>
          {history.map((item, i) => (
            <p key={i}>
              Hour: {item.hour} | Vehicles: {item.vehicles} → {item.result}
            </p>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-10 text-gray-500 text-sm">
        Built with  using ML + React + Google Maps + Weather API
      </footer>
    </div>
  );
}

export default App;






















































































































































































































































































































































































