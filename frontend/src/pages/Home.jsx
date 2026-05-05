import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Home() {
  const [trackingId, setTrackingId] = useState("");
  const [parcel, setParcel] = useState(null);
  const [lastStatus, setLastStatus] = useState("");
  const [lastLocation, setLastLocation] = useState("");

  // ── SMS modal state ──
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsMessage, setSmsMessage] = useState("");

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
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
      if (mapInstanceRef.current) mapInstanceRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (parcel) renderMap(parcel);
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

    if (mapInstanceRef.current) mapInstanceRef.current.remove();

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
      const m = L.marker(cityCoords[parcelData.originCity], { icon: originIcon })
        .addTo(map).bindPopup("Origin: " + parcelData.originCity);
      markersRef.current.push(m);
    }

    (parcelData.transitHubs || []).forEach((hub) => {
      if (cityCoords[hub]) {
        const m = L.marker(cityCoords[hub], { icon: hubIcon })
          .addTo(map).bindPopup("Transit Hub: " + hub);
        markersRef.current.push(m);
      }
    });

    if (cityCoords[parcelData.destinationCity]) {
      const m = L.marker(cityCoords[parcelData.destinationCity], { icon: destIcon })
        .addTo(map).bindPopup("Destination: " + parcelData.destinationCity);
      markersRef.current.push(m);
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

      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = setInterval(() => trackParcel(true), 5000);
    } catch (err) {
      console.error(err);
      if (!isAutoRefresh) alert("Server error");
    }
  };

  // ── Send SMS ──
  const handleSendSms = async () => {
    const phoneNum = phone.trim();
    if (!phoneNum) {
      setSmsMessage("Please enter a phone number.");
      return;
    }

    setSmsSending(true);
    setSmsMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notify-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNum,
          trackingId: trackingId.trim(),
          status: parcel.status,
          location: parcel.currentLocation,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSmsMessage("✅ SMS sent successfully!");
        setTimeout(() => {
          setShowSmsModal(false);
          setPhone("");
          setSmsMessage("");
        }, 2000);
      } else {
        setSmsMessage("❌ " + (data.message || "Failed to send SMS."));
      }
    } catch (err) {
      console.error(err);
      setSmsMessage("❌ Server error. Try again.");
    } finally {
      setSmsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") trackParcel();
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

        /* ── SMS Button ── */
        .sms-btn {
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .sms-btn:hover {
          background: #1ebe59;
        }

        /* ── SMS Modal Overlay ── */
        .sms-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .sms-modal {
          background: #fff;
          border-radius: 18px;
          padding: 32px 28px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          position: relative;
        }

        .sms-modal h3 {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }

        .sms-modal p {
          margin: 0 0 20px;
          font-size: 14px;
          color: #6b7280;
        }

        .sms-modal input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: 0.2s;
        }

        .sms-modal input:focus {
          border-color: #25D366;
          box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.15);
        }

        .sms-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .sms-send-btn {
          flex: 1;
          padding: 12px;
          background: #111;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .sms-send-btn:hover:not(:disabled) {
          background: #25D366;
        }

        .sms-send-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .sms-cancel-btn {
          padding: 12px 18px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .sms-cancel-btn:hover {
          background: #e5e7eb;
        }

        .sms-feedback {
          margin-top: 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .sms-close {
          position: absolute;
          top: 14px;
          right: 18px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #9ca3af;
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

          .sms-modal {
            margin: 0 16px;
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

              {/* ── SMS Update Button ── */}
              <button
                className="sms-btn"
                onClick={() => {
                  setShowSmsModal(true);
                  setSmsMessage("");
                  setPhone("");
                }}
              >
                📩 Get Detailed Report on Phone via SMS
              </button>

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
                      <strong>{item.location}</strong> — {item.status} ({item.time})
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

      {/* ── SMS Modal ── */}
      {showSmsModal && (
        <div
          className="sms-overlay"
          onClick={(e) => {
            if (e.target.className === "sms-overlay") {
              setShowSmsModal(false);
            }
          }}
        >
          <div className="sms-modal">
            <button
              className="sms-close"
              onClick={() => setShowSmsModal(false)}
            >
              ✕
            </button>

            <h3>📩 SMS Parcel Report</h3>
            <p>
              Enter your phone number and we'll send a detailed status report
              for tracking ID <strong>{trackingId}</strong> right away.
            </p>

            <input
              type="tel"
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendSms();
              }}
              autoFocus
            />

            <div className="sms-modal-actions">
              <button
                className="sms-send-btn"
                onClick={handleSendSms}
                disabled={smsSending}
              >
                {smsSending ? "Sending..." : "Send SMS"}
              </button>
              <button
                className="sms-cancel-btn"
                onClick={() => setShowSmsModal(false)}
              >
                Cancel
              </button>
            </div>

            {smsMessage && (
              <p className="sms-feedback">{smsMessage}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
