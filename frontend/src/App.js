import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function App() {
  const [hour, setHour] = useState("");
  const [vehicles, setVehicles] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "300px",
  };

  const center = {
    lat: 21.1702,
    lng: 72.8311,
  };

  const predictTraffic = async () => {

    //  Validation
    if (!hour || !vehicles) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:5000/predict", {
        hour: Number(hour),
        vehicle_count: Number(vehicles),
      });

      setResult(res.data.traffic);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error connecting to backend");
    }
  };

  //  Real-time update every 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      if (hour && vehicles) {
        predictTraffic();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [hour, vehicles]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      {/*  Title */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
         Traffic Prediction System
      </h1>

      {/*  Map */}
      <div className="w-full max-w-3xl bg-white p-4 rounded-2xl shadow-lg">
        <LoadScript googleMapsApiKey="AIzaSyCvhzk0_maSlUVI2kPY8zuQgXX01Hm-EG8">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/*  Input Card */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        
        <h2 className="text-xl font-semibold text-gray-700">
          Enter Traffic Details
        </h2>

        <input
          type="number"
          placeholder="Hour (0-23)"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setHour(e.target.value)}
        />

        <input
          type="number"
          placeholder="Vehicle Count"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setVehicles(e.target.value)}
        />

        <button
          onClick={predictTraffic}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Predicting..." : "Predict Traffic"}
        </button>
      </div>

      {/*  Result Card */}
      {result && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md text-center">
          <h2
            className={`text-2xl font-bold ${
              result === "High"
                ? "text-red-500"
                : result === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
             Traffic Level: {result}
          </h2>
        </div>
      )}

      {/*  Footer */}
      <footer className="mt-10 text-gray-500 text-sm">
        Built with  using ML + React + Google Maps
      </footer>

    </div>
  );
}

export default App;























































































































































































































































































































































