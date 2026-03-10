import { useState } from "react";
import { Link } from "react-router-dom";

function Support() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! Please enter your Tracking ID (e.g., TX1001) and your issue.",
      sender: "bot",
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [awaitingTrackingId, setAwaitingTrackingId] = useState(false);
  const [userIssue, setUserIssue] = useState("");

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const extractTrackingId = (text) => {
    const match = text.match(/TX\d{4}/i);
    return match ? match[0].toUpperCase() : null;
  };

  const generateReason = (issue, trackingId) => {
    const msg = issue.toLowerCase();

    if (msg.includes("delay") || msg.includes("late")) {
      return `Parcel ${trackingId} may be delayed due to transit hub congestion, route distance, or weather conditions. Please track it for the latest movement updates.`;
    }

    if (msg.includes("not delivered") || msg.includes("not received")) {
      return `For ${trackingId}, if status shows delivered but not received, please check with neighbors or security and then contact support with this tracking ID.`;
    }

    if (msg.includes("delivery time") || msg.includes("when")) {
      return `Estimated delivery time for ${trackingId} depends on distance, package weight, and routing through transit hubs.`;
    }

    if (msg.includes("address")) {
      return `Address change for ${trackingId} is only possible before dispatch. If parcel is already in transit, modification may not be allowed.`;
    }

    return `For parcel ${trackingId}, please track the shipment to view current location and status updates.`;
  };

  const botReply = (input) => {
    const trackingId = extractTrackingId(input);

    if (!awaitingTrackingId) {
      setUserIssue(input);
      setAwaitingTrackingId(true);
      return "Sure, I can help with that. Could you please provide your Tracking ID (e.g., TX1001)?";
    }

    if (awaitingTrackingId && trackingId) {
      setAwaitingTrackingId(false);
      const response = generateReason(userIssue, trackingId);
      setUserIssue("");
      return response;
    }

    return "Please provide a valid Tracking ID like TX1001 so I can check your delivery issue.";
  };

  const sendMessage = () => {
    const text = userInput.trim();
    if (!text) return;

    addMessage(text, "user");
    const reply = botReply(text);

    setTimeout(() => {
      addMessage(reply, "bot");
    }, 500);

    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #f3f4f6, #e0f2fe);
        }

        .support-container {
          max-width: 950px;
          margin: 40px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
          font-weight: 700;
        }

        .faq {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .faq-item {
          background: #f9fafb;
          padding: 18px;
          border-radius: 12px;
          border-left: 5px solid #ff3b3b;
        }

        .faq-item strong {
          display: block;
          margin-bottom: 8px;
          font-size: 15px;
        }

        .faq-item p {
          color: #555;
          font-size: 14px;
        }

        .chatbot {
          margin-top: 40px;
        }

        .chatbox {
          height: 320px;
          border-radius: 14px;
          padding: 18px;
          overflow-y: auto;
          background: #f1f5f9;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
        }

        .msg {
          display: flex;
          margin: 12px 0;
        }

        .msg.user {
          justify-content: flex-end;
        }

        .msg span {
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 70%;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
        }

        .user span {
          background: #ff3b3b;
          color: #fff;
        }

        .bot span {
          background: #e2e8f0;
          color: #000;
        }

        .chat-input {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .chat-input textarea {
          width: 100%;
          min-height: 100px;
          padding: 16px 18px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          font-size: 16px;
          line-height: 1.5;
          resize: vertical;
          outline: none;
          background: #ffffff;
          color: #111827;
          font-family: inherit;
        }

        .chat-input textarea:focus {
          border-color: #ff3b3b;
          box-shadow: 0 0 0 3px rgba(255, 59, 59, 0.15);
        }

        .chat-input textarea::placeholder {
          color: #6b7280;
        }

        .chat-input button {
          align-self: flex-end;
          padding: 14px 24px;
          background: #000;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          min-width: 120px;
          transition: background 0.2s ease, transform 0.15s ease;
        }

        .chat-input button:hover {
          background: #ff3b3b;
        }

        .chat-input button:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .faq {
            grid-template-columns: 1fr;
          }

          .support-container {
            margin: 20px 14px;
            padding: 20px;
          }

          .chatbox {
            height: 280px;
          }

          .chat-input textarea {
            min-height: 90px;
            font-size: 15px;
          }

          .chat-input button {
            width: 100%;
            align-self: stretch;
          }

          .msg span {
            max-width: 85%;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">TrackExpress</div>
        <ul className="nav-links">
          <li><Link to="/booking">Manage Booking</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>
      </nav>

      <div className="support-container">
        <h2>Delivery Help & Support</h2>

        <div className="faq">
          <div className="faq-item">
            <strong>Why is my delivery delayed?</strong>
            <p>Delays can occur due to weather, route congestion, or high parcel volume at transit hubs.</p>
          </div>

          <div className="faq-item">
            <strong>What does "In Transit" mean?</strong>
            <p>Your parcel is currently moving between cities or logistics hubs towards the destination.</p>
          </div>

          <div className="faq-item">
            <strong>What does "Out for Delivery" indicate?</strong>
            <p>The parcel is with the delivery agent and will be delivered soon.</p>
          </div>

          <div className="faq-item">
            <strong>Can I change delivery address?</strong>
            <p>Address changes are only allowed before dispatch. After that, changes may not be possible.</p>
          </div>

          <div className="faq-item">
            <strong>Tracking status not updating?</strong>
            <p>Status updates pause when parcels travel between hubs. Please check again later.</p>
          </div>

          <div className="faq-item">
            <strong>Estimated delivery time?</strong>
            <p>It depends on distance, package weight, and transit routing.</p>
          </div>
        </div>

        <div className="chatbot">
          <h3 style={{ marginBottom: "10px" }}>Ask Delivery Assistant</h3>

          <div className="chatbox">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <textarea
              placeholder="Type your issue here... Example: Delay in delivery for TX1001"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Support;