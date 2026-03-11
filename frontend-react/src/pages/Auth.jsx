import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regId, setRegId] = useState("");
  const [regPass, setRegPass] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [regMsg, setRegMsg] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    if (!regId || !regPass) {
      setRegMsg("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: regId, password: regPass }),
      });

      const data = await res.json();

      if (data.success) {
        setRegMsg("Account created! Redirecting to login...");
        setRegId("");
        setRegPass("");
        setTimeout(() => {
          setIsRegister(false);
          setRegMsg("");
        }, 1500);
      } else {
        setRegMsg(data.message || "Registration failed");
      }
    } catch {
      setRegMsg("Server not connected");
    }
  };

  const login = async () => {
    if (!loginId || !loginPass) {
      setLoginMsg("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loginId, password: loginPass }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", loginId);
        setLoginMsg("Login successful!");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setLoginMsg(data.message || "Invalid login");
      }
    } catch {
      setLoginMsg("Server not connected");
    }
  };

  return (
    <div className="page">
      <div className="route-line one"></div>
      <div className="route-line two"></div>
      <div className="route-line three"></div>

      <div className="header">
        <div className="header-badge">Logistics SaaS Platform</div>
        <h1 className="brand">
          Track<span>Express</span>
        </h1>
        <p className="header-tagline">
          Powerful parcel booking, live shipment visibility, and delivery support
          designed for a modern logistics workflow.
        </p>

        <div className="header-points">
          <div className="point-card">
            <h4>Live Tracking</h4>
            <p>Monitor parcel movement, status changes, and destination progress in real time.</p>
          </div>
          <div className="point-card">
            <h4>Smart Booking</h4>
            <p>Create shipments quickly with route details, sender information, and delivery flow.</p>
          </div>
          <div className="point-card">
            <h4>Reliable Support</h4>
            <p>Give users instant clarity on delays, delivery stages, and common shipment issues.</p>
          </div>
        </div>

        <div className="header-img-wrap">
          <img
            src="https://media.istockphoto.com/id/1133999388/photo/delivery-man-with-a-parcel-box-in-the-car-stock-image-save.jpg?s=612x612&w=0&k=20&c=RqdZ4502uEdAqGlngSrgANzNNPb2gzbzUnm75osAio0="
            className="header-img"
            alt="TrackExpress logistics"
          />
        </div>
      </div>

      <div className="card">
        {!isRegister ? (
          <div>
            <div className="card-badge">Secure Access</div>
            <h2>Welcome back</h2>
            <p className="subtitle">
              Sign in to access your tracking dashboard and manage shipments.
            </p>

            <div className="field-group">
              <label className="field-label">User ID</label>
              <input
                type="text"
                placeholder="Enter your user ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button className="primary" onClick={login}>
              Continue
            </button>

            <p className="msg">{loginMsg}</p>

            <p className="switch">
              New here?{" "}
              <span onClick={() => setIsRegister(true)}>Create an account</span>
            </p>
          </div>
        ) : (
          <div>
            <div className="card-badge">Create Account</div>
            <h2>Join TrackExpress</h2>
            <p className="subtitle">
              Register to start booking, tracking, and managing parcels.
            </p>

            <div className="field-group">
              <label className="field-label">User ID</label>
              <input
                type="text"
                placeholder="Create your user ID"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Create your password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
              />
            </div>

            <button className="secondary" onClick={register}>
              Create Account
            </button>

            <p className="msg">{regMsg}</p>

            <p className="switch">
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;