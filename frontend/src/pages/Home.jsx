import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Home() {
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState(null);
  const [lastStatus, setLastStatus] = useState("");
  const [lastLocation, setLastLocation] = useState("");

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const autoRefreshRef = useRef(null);

  const cityCoords = {
    Chennai: [13.0827, 80.2707],
    Bangalore: [12.9716, 77.5946],
    Hyderabad: [17.385, 78.4867],
    Delhi: [28.6139, 77.209],
    Mumbai: [19.076, 72.8777],
    Kolkata: [22.5726, 88.3639],
    Nagpur: [21.1458, 79.0882],
    Patna: [25.5941, 85.1376],
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/";
    }

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (parcel) {
      renderMap(parcel);
    }
  }, [parcel]);

  const getCurrentStep = (status) => {
    const steps = {
      Booked: 1,
      "In Transit": 2,
      "Out for Delivery": 3,
      Delivered: 4,
    };
    return steps[status] || 1;
  };

  const renderMap = (parcelData) => {
    const routeCities = [
      parcelData.originCity,
      ...(parcelData.transitHubs || []),
      parcelData.destinationCity,
    ];

    const routeCoords = routeCities.map((city) => cityCoords[city]).filter(Boolean);

    if (!mapRef.current || routeCoords.length === 0) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView(routeCoords[0], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.polyline(routeCoords, { color: "red", weight: 4 }).addTo(map);
    map.fitBounds(routeCoords);

    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    const originIcon = L.icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      iconSize: [32, 32],
    });

    const hubIcon = L.icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      iconSize: [32, 32],
    });

    const destIcon = L.icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      iconSize: [32, 32],
    });

    if (cityCoords[parcelData.originCity]) {
      const marker = L.marker(cityCoords[parcelData.originCity], { icon: originIcon })
        .addTo(map)
        .bindPopup("Origin: " + parcelData.originCity);
      markersRef.current.push(marker);
    }

    (parcelData.transitHubs || []).forEach((hub) => {
      if (cityCoords[hub]) {
        const marker = L.marker(cityCoords[hub], { icon: hubIcon })
          .addTo(map)
          .bindPopup("Transit Hub: " + hub);
        markersRef.current.push(marker);
      }
    });

    if (cityCoords[parcelData.destinationCity]) {
      const marker = L.marker(cityCoords[parcelData.destinationCity], { icon: destIcon })
        .addTo(map)
        .bindPopup("Destination: " + parcelData.destinationCity);
      markersRef.current.push(marker);
    }
  };

  const trackParcel = async (isAutoRefresh = false) => {
    const id = trackingId.trim();
    if (!id) {
      if (!isAutoRefresh) alert("Enter tracking ID");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/track/${id}`);
      const data = await res.json();

      if (!data.success) {
        if (!isAutoRefresh) alert(data.message);
        return;
      }

      const parcelData = data.parcel;

      if (lastLocation && lastLocation !== parcelData.currentLocation) {
        alert(`Parcel reached ${parcelData.currentLocation}`);
      }

      if (lastStatus && lastStatus !== parcelData.status) {
        alert(`Status updated: ${parcelData.status}`);
      }

      setLastStatus(parcelData.status);
      setLastLocation(parcelData.currentLocation);
      setParcel(parcelData);

      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }

      autoRefreshRef.current = setInterval(() => {
        trackParcel(true);
      }, 5000);
    } catch (err) {
      console.error(err);
      if (!isAutoRefresh) {
        alert("Server error");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      trackParcel();
    }
  };

  const currentStep = parcel ? getCurrentStep(parcel.status) : 0;

  return (
    <>
      <style>{`
        .progress-container {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          position: relative;
          gap: 8px;
        }

        .progress-container::before {
          content: "";
          position: absolute;
          top: 20px;
          left: 0;
          width: 100%;
          height: 4px;
          background: #ddd;
          z-index: 0;
        }

        .progress-step {
          position: relative;
          z-index: 1;
          text-align: center;
          flex: 1;
        }

        .circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ddd;
          color: white;
          line-height: 40px;
          margin: auto;
          font-weight: bold;
        }

        .active .circle {
          background: #28a745;
        }

        .label {
          margin-top: 8px;
          font-size: 14px;
        }

        .timeline-box {
          margin-top: 18px;
          background: #f9fafb;
          padding: 16px;
          border-radius: 12px;
        }

        .timeline-box h4 {
          margin-bottom: 10px;
        }

        .timeline-box ul {
          padding-left: 18px;
          margin: 0;
        }

        .timeline-box li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .map-box {
          height: 300px;
          margin-top: 15px;
          border-radius: 12px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .progress-container {
            flex-wrap: wrap;
            gap: 14px;
          }

          .progress-container::before {
            display: none;
          }

          .progress-step {
            min-width: 45%;
          }
        }
      `}</style>

      <Navbar />

      <section className="hero">
        <div className="hero-text">
          <h1>
            PARCEL TRACKING <br />
            <span>SYSTEM</span>
          </h1>

          <p>Fast, secure and real-time courier tracking at your fingertips.</p>

          <div className="track-box">
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={() => trackParcel()}>Track Now</button>
          </div>

          {parcel && (
            <div className="result">
              <h3>{parcel.status}</h3>
              <p>Expected Delivery: {parcel.expectedDeliveryDate}</p>
              <p>Current Location: {parcel.currentLocation}</p>

              <div className="progress-container">
                <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
                  <div className="circle">1</div>
                  <div className="label">Booked</div>
                </div>

                <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
                  <div className="circle">2</div>
                  <div className="label">In Transit</div>
                </div>

                <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
                  <div className="circle">3</div>
                  <div className="label">Out for Delivery</div>
                </div>

                <div className={`progress-step ${currentStep >= 4 ? "active" : ""}`}>
                  <div className="circle">4</div>
                  <div className="label">Delivered</div>
                </div>
              </div>

              <div className="timeline-box">
                <h4>Movement History</h4>
                <ul>
                  {(parcel.history || []).map((item, index) => (
                    <li key={index}>
                      <strong>{item.location}</strong> - {item.status} ({item.time})
                    </li>
                  ))}
                </ul>
              </div>

              <div ref={mapRef} className="map-box"></div>
            </div>
          )}
        </div>

        <div className="hero-image">
          <img
            src="https://static.vecteezy.com/system/resources/previews/023/743/919/non_2x/courier-delivery-man-holding-parcel-box-with-mobile-phone-fast-online-delivery-service-online-ordering-internet-e-commerce-ideas-for-websites-or-banners-3d-perspective-illustration-free-png.png"
            alt="Delivery"
          />
        </div>
      </section>
    </>
  );
}

export default Home;