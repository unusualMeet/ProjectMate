import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";
import darkLogo from "../assets/darklogo.png";
const Navbar = ({
  darkMode,
  setDarkMode,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = isLoggedIn;
  const userName = localStorage.getItem("userName");
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  setIsLoggedIn(false);
  window.location.href = "/login";
};
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img
          src={darkMode ? darkLogo : logo}
          alt="ProjectMate"
          className="logo"
        />
      </div>

      {/* Desktop Menu */}
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/projects" className="nav-link">
          Projects
        </Link>
        <Link to="/myprojects" className="nav-link">
          My Projects
        </Link>
        <Link to="/myapplications" className="nav-link">
          Applications
        </Link>
      </div>

      <div className="auth-section">
        <label className="theme-switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>

        {!token ? (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="nav-user-section">
            <Link to="/profile" className="avatar-link">
              <div className="navbar-avatar">
                <i className="fa-solid fa-circle-user"></i>
              </div>
            </Link>

            <button onClick={handleLogout} className="signup-btn">
              Logout
            </button>
          </div>
        )}
      </div>
      {/* Mobile Hamburger */}
      {!menuOpen && (
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </button>
      )}

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "active" : ""}`}>
        <div className="drawer-header">
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="drawer-profile">
          <i className="fa-solid fa-circle-user"></i>

          <div>
            <h4>{userName || "ProjectMate User"}</h4>

            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              View Profile
            </Link>
          </div>
        </div>

        <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-house"></i>
          Home
        </Link>

        <Link
          to="/about"
          className="mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          <i className="fa-solid fa-circle-info"></i>
          About
        </Link>

        <Link
          to="/projects"
          className="mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          <i className="fa-solid fa-diagram-project"></i>
          Projects
        </Link>

        <Link
          to="/myprojects"
          className="mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          <i className="fa-solid fa-briefcase"></i>
          My Projects
        </Link>

        <Link
          to="/myapplications"
          className="mobile-link"
          onClick={() => setMenuOpen(false)}
        >
          <i className="fa-solid fa-file-lines"></i>
          Applications
        </Link>

        <div className="mobile-divider"></div>

        <div className="mobile-theme">
          <span>Dark Mode</span>

          <label className="theme-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {token && (
          <button onClick={handleLogout} className="mobile-logout">
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
