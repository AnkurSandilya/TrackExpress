import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Booking() {
  const [form, setForm] = useState({
    senderName: "",
    receiverName: "",
    originCity: "",
    destinationCity: "",
    weight: "",
  });

  const [bookings, setBookings] = useState([]);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  const cities = [
    "Delhi",
    "Mumbai",
    "Kolkata",
    "Chennai",
    "Bangalore",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Bhopal",
    "Patna",
    "Chandigarh",
    "Kochi",
    "Guwahati",
    "Bhubaneswar",
    "Indore",
    "Nagpur",
    "Surat",
    "Visakhapatnam",
  ];

  const loadBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/booking/all");
      const data = await res.json();

      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filterCities = (value) => {
    if (!value || !value.trim()) return [];
    return cities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleOriginChange = (value) => {
    setForm((prev) => ({ ...prev, originCity: value }));
    setOriginSuggestions(filterCities(value));
  };

  const handleDestinationChange = (value) => {
    setForm((prev) => ({ ...prev, destinationCity: value }));
    setDestinationSuggestions(filterCities(value));
  };

  const createBooking = async () => {
    const payload = {
      senderName: form.senderName.trim(),
      receiverName: form.receiverName.trim(),
      originCity: form.originCity.trim(),
      destinationCity: form.destinationCity.trim(),
      weight: form.weight,
    };

    if (
      !payload.senderName ||
      !payload.receiverName ||
      !payload.originCity ||
      !payload.destinationCity ||
      payload.weight === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Booking created. Tracking ID: ${data.trackingId}`);

        setForm({
          senderName: "",
          receiverName: "",
          originCity: "",
          destinationCity: "",
          weight: "",
        });

        setOriginSuggestions([]);
        setDestinationSuggestions([]);

        await loadBookings();
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking create error:", error);
      alert("Server not connected");
    }
  };

  const safeOriginSuggestions = Array.isArray(originSuggestions)
    ? originSuggestions
    : [];
  const safeDestinationSuggestions = Array.isArray(destinationSuggestions)
    ? destinationSuggestions
    : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <>
      <style>{`
        .booking-page {
          min-height: calc(100vh - 76px);
          width: 100%;
          padding: 40px 20px;
        }

        .booking-layout {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
        }

        .booking-card {
          background: #ffffff;
          padding: 32px;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .booking-card h2 {
          text-align: center;
          margin-bottom: 10px;
          font-size: 28px;
          font-weight: 700;
          color: #111;
        }

        .booking-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 16px;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          font-size: 15px;
          outline: none;
          transition: 0.2s ease;
          background: #fff;
        }

        .form-group input:focus {
          border-color: #ff3b3b;
          box-shadow: 0 0 0 3px rgba(255, 59, 59, 0.12);
        }

        .booking-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #000;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
          margin-top: 8px;
        }

        .booking-btn:hover {
          background: #ff3b3b;
        }

        .toggle-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .toggle-btn:hover {
          opacity: 0.92;
        }

        .autocomplete-items {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          max-height: 160px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .autocomplete-items div {
          padding: 10px 14px;
          cursor: pointer;
          font-size: 14px;
        }

        .autocomplete-items div:hover {
          background: #f9fafb;
        }

        .table-wrap {
          overflow-x: auto;
          margin-top: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        th, td {
          text-align: left;
          padding: 14px 12px;
          border-bottom: 1px solid #ececec;
          font-size: 14px;
        }

        th {
          background: #f9fafb;
          color: #111827;
          font-weight: 700;
        }

        td {
          color: #4b5563;
        }

        .tracking-id {
          color: #ff3b3b;
          font-weight: 700;
        }

        .empty-booking {
          text-align: center;
          color: #6b7280;
          padding: 18px 0 6px;
        }

        @media (max-width: 768px) {
          .booking-page {
            padding: 24px 14px;
          }

          .booking-card {
            padding: 22px 16px;
          }

          .booking-card h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <Navbar />

      <div className="booking-page">
        <div className="booking-layout">
          <div className="booking-card">
            <h2>Create Booking</h2>
            <p className="booking-subtitle">
              Enter complete shipment details to generate a new tracking ID.
            </p>

            <div className="form-group">
              <label>Sender Name</label>
              <input
                type="text"
                placeholder="Enter sender name"
                value={form.senderName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, senderName: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Receiver Name</label>
              <input
                type="text"
                placeholder="Enter receiver name"
                value={form.receiverName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, receiverName: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label>Origin City</label>
              <input
                type="text"
                placeholder="Start typing city name"
                value={form.originCity}
                onChange={(e) => handleOriginChange(e.target.value)}
              />
              {safeOriginSuggestions.length > 0 && (
                <div className="autocomplete-items">
                  {safeOriginSuggestions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, originCity: city }));
                        setOriginSuggestions([]);
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
                placeholder="Start typing city name"
                value={form.destinationCity}
                onChange={(e) => handleDestinationChange(e.target.value)}
              />
              {safeDestinationSuggestions.length > 0 && (
                <div className="autocomplete-items">
                  {safeDestinationSuggestions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, destinationCity: city }));
                        setDestinationSuggestions([]);
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
                min="0.1"
                step="0.1"
                placeholder="Enter package weight"
                value={form.weight}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, weight: e.target.value }))
                }
              />
            </div>

            <button className="booking-btn" onClick={createBooking}>
              Create Booking
            </button>
          </div>

          <button
            className="toggle-btn"
            style={{ background: showBookings ? "#000" : "#ff3b3b" }}
            onClick={() => setShowBookings(!showBookings)}
          >
            {showBookings ? "Hide My Bookings" : "Show My Bookings"}
          </button>

          {showBookings && (
            <div className="booking-card">
              <h2>Your Bookings</h2>

              {safeBookings.length === 0 ? (
                <p className="empty-booking">No bookings yet</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tracking ID</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeBookings.map((booking, index) => (
                        <tr key={index}>
                          <td className="tracking-id">{booking.trackingId}</td>
                          <td>{booking.senderName}</td>
                          <td>{booking.receiverName}</td>
                          <td>{booking.originCity}</td>
                          <td>{booking.destinationCity}</td>
                          <td>{booking.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Booking;