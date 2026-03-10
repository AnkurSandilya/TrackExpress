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
      <div className="header">
        <h1 className="brand">TrackExpress</h1>
        <p className="header-tagline">
          Smart parcel booking, live tracking, and delivery support — all in one
          powerful and beautiful experience.
        </p>
        <img
          src="https://img.freepik.com/free-vector/people-vector_53876-17373.jpg"
          className="header-img"
          alt="header"
        />
      </div>

      <div className="card">
        {!isRegister ? (
          <div>
            
            <h2>Welcome back</h2>
            <p className="subtitle">Log in to continue tracking your parcels</p>

            <input
              type="text"
              placeholder="User ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
            />

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
            
            <h2>Create Account</h2>
            <p className="subtitle">Sign up to start tracking parcels</p>

            <input
              type="text"
              placeholder="Create User ID"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Create Password"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
            />

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