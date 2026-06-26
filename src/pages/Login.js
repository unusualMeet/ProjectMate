import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    if (!email || !password) {
      showAlert("error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("BACKEND ERROR:", data);
      }
      if (data.success) {
        sessionStorage.setItem("token", data.authtoken);
        sessionStorage.setItem("userName", data.user.name);
        sessionStorage.setItem("userId", data.user.id || data.user._id);

        setIsLoggedIn(true);
        showAlert("success", "Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        showAlert(
          "error",
          data.errors?.[0]?.msg || data.error || "Invalid credentials.",
        );
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      showAlert("error", "Server error. Please try again later.");
    }
  };

  return (
    <div className="login-outer-wrapper">
      <div className="login-split-card">
        {/* Left Side: Login Form Interface */}
        <div className="login-left-panel">
          <h2 className="brand-title">ProjectMate</h2>

          {alert.message && (
            <div className={`auth-alert alert-${alert.type}`}>
              {alert.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* <Link to="/forgot-password" className="forgot-password-link"> */}
              {/* Forgot password? */}
            {/* </Link> */}

            <button type="submit" className="auth-btn">
              Sign in
            </button>
          </form>

          <p className="auth-redirect">
            New to ProjectMate? <Link to="/signup">Create Account</Link>
          </p>
        </div>

        {/* Right Side: Marketing/Theme Content Panel */}
        <div className="login-right-panel">
          <div className="right-panel-artwork">
            <div className="geometric-gear-art"></div>
          </div>
          <h3 className="right-title">Your Perfect Team is One Click Away </h3>
          <p className="right-subtitle">
            Stop working on solo assignments. Connect with developers, UI/UX
            designers, and database builders in your college to turn empty
            repositories into production-ready platforms
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
