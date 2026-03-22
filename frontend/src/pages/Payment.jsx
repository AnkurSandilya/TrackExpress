import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 4);

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 3);
    setCvv(value);
  };

  const handlePayment = async () => {
    if (!cardNumber || !cardHolder.trim() || expiry.length !== 5 || cvv.length !== 3) {
      alert("Please fill payment details correctly");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Booking created successfully");
        navigate("/booking");
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Payment/Booking error:", error);
      alert("Server not connected");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/booking");
  };

  if (!bookingData) {
    return (
      <>
        <Navbar />
        <div className="payment-page">
          <div className="payment-shell">
            <div className="payment-card empty-state">
              <h2>No booking data found</h2>
              <p>Please create a booking first before proceeding to payment.</p>
              <button className="secondary-btn" onClick={() => navigate("/booking")}>
                Go Back
              </button>
            </div>
          </div>

          <style>{styles}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="payment-page">
        <div className="payment-shell">
          <div className="payment-header">
            <span className="payment-badge">Secure Dummy Payment</span>
            <h1>Complete Your Booking Payment</h1>
            <p>Proceed with payment to confirm and save your parcel booking.</p>
          </div>

          <div className="payment-grid">
            <div className="payment-card summary-card">
              <div className="section-head">
                <h2>Booking Summary</h2>
                <span className="section-tag">TrackExpress</span>
              </div>

              <div className="summary-list">
                <div className="summary-row">
                  <span>Sender</span>
                  <strong>{bookingData.senderName}</strong>
                </div>
                <div className="summary-row">
                  <span>Receiver</span>
                  <strong>{bookingData.receiverName}</strong>
                </div>
                <div className="summary-row">
                  <span>Origin</span>
                  <strong>{bookingData.originCity}</strong>
                </div>
                <div className="summary-row">
                  <span>Destination</span>
                  <strong>{bookingData.destinationCity}</strong>
                </div>
                <div className="summary-row">
                  <span>Weight</span>
                  <strong>{bookingData.weight} kg</strong>
                </div>
              </div>

              <div className="price-box">
                <div className="price-row">
                  <span>Delivery Charge</span>
                  <strong>₹99</strong>
                </div>
                <div className="price-row">
                  <span>Platform Fee</span>
                  <strong>₹10</strong>
                </div>
                <div className="price-row total-row">
                  <span>Total Amount</span>
                  <strong>₹109</strong>
                </div>
              </div>
            </div>

            <div className="payment-card form-card">
              <div className="section-head">
                <h2>Payment Details</h2>
                <span className="section-tag dark-tag">Card</span>
              </div>

              <div className="card-preview">
                <div className="card-top">
                  <span className="chip"></span>
                  <span className="brand">TRACKEXPRESS PAY</span>
                </div>

                <div className="card-number-preview">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>

                <div className="card-bottom">
                  <div>
                    <small>Card Holder</small>
                    <div>{cardHolder || "YOUR NAME"}</div>
                  </div>
                  <div>
                    <small>Expiry</small>
                    <div>{expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                />
              </div>

              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                  />
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength={3}
                  />
                </div>
              </div>

              <button className="primary-btn" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Proceed Payment"}
              </button>

              <button className="secondary-btn" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    </>
  );
}

const styles = `
  .payment-page {
    min-height: calc(100vh - 76px);
    background: linear-gradient(180deg, #f8fbff 0%, #eef4f9 100%);
    padding: 40px 20px 60px;
  }

  .payment-shell {
    max-width: 1180px;
    margin: 0 auto;
  }

  .payment-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .payment-header h1 {
    margin: 12px 0 10px;
    font-size: 40px;
    line-height: 1.1;
    color: #111827;
    font-weight: 800;
  }

  .payment-header p {
    margin: 0;
    color: #6b7280;
    font-size: 16px;
  }

  .payment-badge {
    display: inline-block;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(239, 68, 68, 0.08);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.18);
    font-size: 13px;
    font-weight: 700;
  }

  .payment-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 24px;
    align-items: start;
  }

  .payment-card {
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(226, 232, 240, 0.9);
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(8px);
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .section-head h2 {
    margin: 0;
    font-size: 24px;
    color: #111827;
    font-weight: 800;
  }

  .section-tag {
    font-size: 12px;
    font-weight: 700;
    padding: 7px 12px;
    border-radius: 999px;
    background: #fee2e2;
    color: #b91c1c;
  }

  .dark-tag {
    background: #111827;
    color: #ffffff;
  }

  .summary-list {
    display: grid;
    gap: 12px;
    margin-bottom: 22px;
  }

  .summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #edf2f7;
  }

  .summary-row span {
    color: #6b7280;
    font-size: 14px;
  }

  .summary-row strong {
    color: #111827;
    font-size: 15px;
  }

  .price-box {
    border-radius: 18px;
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    color: #fff;
    padding: 18px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 15px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .price-row:last-child {
    border-bottom: none;
  }

  .total-row {
    margin-top: 6px;
    padding-top: 14px;
    font-size: 17px;
    font-weight: 800;
    color: #fca5a5;
  }

  .card-preview {
    background: linear-gradient(135deg, #111827 0%, #ef4444 100%);
    color: white;
    border-radius: 22px;
    padding: 22px;
    margin-bottom: 22px;
    box-shadow: 0 18px 36px rgba(239, 68, 68, 0.18);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .chip {
    width: 42px;
    height: 30px;
    border-radius: 8px;
    background: linear-gradient(135deg, #fcd34d, #f59e0b);
    display: inline-block;
  }

  .brand {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    opacity: 0.95;
  }

  .card-number-preview {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 24px;
    min-height: 32px;
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    gap: 18px;
  }

  .card-bottom small {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    opacity: 0.78;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }

  .card-bottom div div {
    font-size: 14px;
    font-weight: 700;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #374151;
    font-size: 14px;
    font-weight: 700;
  }

  .form-group input {
    width: 100%;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid #d1d5db;
    background: #fff;
    font-size: 15px;
    color: #111827;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .form-group input:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    border: none;
    border-radius: 14px;
    padding: 15px 16px;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.22s ease;
  }

  .primary-btn {
    background: linear-gradient(135deg, #111827 0%, #000000 100%);
    color: #fff;
    margin-top: 6px;
    margin-bottom: 10px;
  }

  .primary-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 22px rgba(0,0,0,0.15);
  }

  .secondary-btn {
    background: #eef2f7;
    color: #111827;
  }

  .secondary-btn:hover {
    background: #e5e7eb;
  }

  .primary-btn:disabled,
  .secondary-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .empty-state {
    max-width: 520px;
    margin: 0 auto;
    text-align: center;
  }

  .empty-state h2 {
    margin: 0 0 10px;
    font-size: 28px;
    color: #111827;
  }

  .empty-state p {
    margin: 0 0 18px;
    color: #6b7280;
  }

  @media (max-width: 900px) {
    .payment-grid {
      grid-template-columns: 1fr;
    }

    .payment-header h1 {
      font-size: 32px;
    }
  }

  @media (max-width: 600px) {
    .payment-page {
      padding: 24px 14px 40px;
    }

    .payment-card {
      padding: 20px 16px;
      border-radius: 20px;
    }

    .payment-header h1 {
      font-size: 28px;
    }

    .section-head h2 {
      font-size: 20px;
    }

    .card-number-preview {
      font-size: 18px;
      letter-spacing: 1px;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
`;

export default Payment;