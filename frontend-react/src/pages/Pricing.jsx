import { useState } from "react";
import Navbar from "../components/Navbar";

function Pricing() {
  const cities = [
    "Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Pune", "Ahmedabad",
    "Jaipur", "Lucknow", "Bhopal", "Patna", "Chandigarh", "Kochi", "Guwahati", "Bhubaneswar",
    "Indore", "Nagpur", "Surat", "Visakhapatnam"
  ];

  const distanceMap = {
    "Delhi-Mumbai": 1400,
    "Delhi-Chennai": 2200,
    "Delhi-Bangalore": 2150,
    "Delhi-Kolkata": 1500,
    "Mumbai-Chennai": 1330,
    "Mumbai-Bangalore": 980,
    "Mumbai-Kolkata": 2050,
    "Chennai-Bangalore": 350,
    "Hyderabad-Bangalore": 570,
    "Hyderabad-Chennai": 630,
    "Kolkata-Guwahati": 1000,
    "Delhi-Jaipur": 280,
    "Delhi-Lucknow": 550
  };

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [result, setResult] = useState(null);

  const getDistance = (a, b) => {
    if (a === b) return 0;
    const key1 = `${a}-${b}`;
    const key2 = `${b}-${a}`;
    return distanceMap[key1] || distanceMap[key2] || 1200;
  };

  const filterCities = (value) => {
    if (!value.trim()) return [];
    return cities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleSourceChange = (value) => {
    setSource(value);
    setSourceSuggestions(filterCities(value));
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
    setDestSuggestions(filterCities(value));
  };

  const calculatePrice = () => {
    if (!source || !destination || !weight) {
      alert("Please fill all fields");
      return;
    }

    const distance = getDistance(source, destination);
    const base = 50;
    const price = base + distance * 0.5 + parseFloat(weight) * 20;

    let time;
    if (distance < 500) time = "2-3 days";
    else if (distance < 1500) time = "3-5 days";
    else time = "5-7 days";

    setResult({
      distance: `${distance} km`,
      price: Math.round(price),
      time,
    });
  };

  return (
    <>
      <style>{`
        .pricing-page {
          background: #f4f6f9;
          min-height: calc(100vh - 76px);
          padding: 40px 20px;
        }

        .pricing-container {
          max-width: 650px;
          margin: 20px auto;
          padding: 30px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }

        .pricing-container h2 {
          text-align: center;
          margin-bottom: 25px;
          font-weight: 700;
          color: #111;
        }

        .form-group {
          margin-bottom: 18px;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #555;
          font-weight: 600;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          font-size: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          outline: none;
          transition: border 0.2s ease;
        }

        .form-group input:focus {
          border-color: #ff3b3b;
          box-shadow: 0 0 0 3px rgba(255,59,59,0.12);
        }

        .pricing-btn {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          background: #ff3b3b;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.3s ease;
        }

        .pricing-btn:hover {
          background: #e53232;
        }

        .result-box {
          margin-top: 25px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #eee;
        }

        .result-box h3 {
          margin-bottom: 15px;
          font-size: 18px;
          color: #222;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          font-size: 15px;
          color: #444;
        }

        .result-row strong {
          color: #000;
        }

        .autocomplete-items {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          max-height: 150px;
          overflow-y: auto;
          z-index: 1000;
        }

        .autocomplete-items div {
          padding: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        .autocomplete-items div:hover {
          background: #f1f1f1;
        }

        @media (max-width: 768px) {
          .pricing-page {
            padding: 24px 14px;
          }

          .pricing-container {
            padding: 22px;
          }
        }
      `}</style>

      <Navbar />

      <div className="pricing-page">
        <div className="pricing-container">
          <h2>Courier Price Estimator</h2>

          <div className="form-group">
            <label>Source City</label>
            <input
              type="text"
              value={source}
              placeholder="Start typing city name"
              onChange={(e) => handleSourceChange(e.target.value)}
            />
            {sourceSuggestions.length > 0 && (
              <div className="autocomplete-items">
                {sourceSuggestions.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSource(city);
                      setSourceSuggestions([]);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Destination City</label>
            <input
              type="text"
              value={destination}
              placeholder="Start typing city name"
              onChange={(e) => handleDestinationChange(e.target.value)}
            />
            {destSuggestions.length > 0 && (
              <div className="autocomplete-items">
                {destSuggestions.map((city, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setDestination(city);
                      setDestSuggestions([]);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Package Weight (kg)</label>
            <input
              type="number"
              value={weight}
              placeholder="Enter weight in kilograms"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <button className="pricing-btn" onClick={calculatePrice}>
            Calculate Estimate
          </button>

          {result && (
            <div className="result-box">
              <h3>Estimated Details</h3>
              <div className="result-row">
                <span>Distance</span>
                <strong>{result.distance}</strong>
              </div>
              <div className="result-row">
                <span>Estimated Price</span>
                <strong>₹ {result.price}</strong>
              </div>
              <div className="result-row">
                <span>Delivery Time</span>
                <strong>{result.time}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Pricing;