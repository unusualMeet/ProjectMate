import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./About.css";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";
import slide4 from "../assets/slide4.png";
import slide5 from "../assets/slide5.png";
const About = () => {
  const images = [slide1, slide2, slide3, slide4, slide5];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <img
          src={images[currentImage]}
          alt="ProjectMate Hero"
          className="hero-bg-image"
        />

        <div className="hero-overlay"></div>

        <h1>Build Projects , Find Teammates , Grow Together.</h1>

        <p>
          ProjectMate helps students connect with talented teammates,
          collaborate on innovative ideas, and gain real-world project
          experience beyond the classroom.
        </p>

        <div className="hero-buttons">
          <Link to="/create-project">
            <button className="hero-btn primary">Create Project</button>
          </Link>

          <Link to="/projects">
            <button className="hero-btn secondary">Explore Projects</button>
          </Link>
        </div>

        <div className="slider-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentImage === index ? "active" : ""}`}
            ></span>
          ))}
        </div>
      </section>
      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <h2>50+</h2>
          <p>Projects Created</p>
        </div>

        <div className="stat-card">
          <h2>200+</h2>
          <p>Students Connected</p>
        </div>

        <div className="stat-card">
          <h2>20+</h2>
          <p>Skills Categories</p>
        </div>

        <div className="stat-card">
          <h2>100%</h2>
          <p>Student Driven</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="features-section">
        <h2 className="section-title">How ProjectMate Works</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>
              <i className="fa-sharp fa-solid fa-1">.</i> Create a Project
            </h3>
            <p>
              Post your project idea, required skills, and team requirements.
            </p>
          </div>

          <div className="feature-card">
            <h3>
              <i className="fa-sharp fa-solid fa-2">.</i> Receive Applications
            </h3>
            <p>Interested students can apply to become part of your team.</p>
          </div>

          <div className="feature-card">
            <h3>
              <i className="fa-sharp fa-solid fa-3">.</i> Build Together
            </h3>
            <p>Collaborate efficiently and complete amazing projects.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Why Choose ProjectMate?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>
              <i className="fa-solid fa-arrows-down-to-people"> </i> Smart Team up
            </h3>
            <p>Find teammates with the exact skills your project requires.</p>
          </div>

          <div className="feature-card">
            <h3>
              <i className="fa-solid fa-diagram-project"></i> Project Discovery
            </h3>
            <p>
              Explore exciting projects created by students across different
              domains.
            </p>
          </div>

          <div className="feature-card">
            <h3>
              <i className="fa-solid fa-briefcase"></i> Portfolio Building
            </h3>
            <p>
              Build real projects that strengthen your resume and portfolio.
            </p>
          </div>

          <div className="feature-card">
            <h3>
              <i className="fa-solid fa-user-lock"></i> Security of data
            </h3>
            <p>Protected user accounts with JWT-based authentication.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Build Your Next Project?</h2>

        <p>
          Join ProjectMate today and start collaborating with talented students.
        </p>
        <Link to={sessionStorage.getItem("token") ? "/projects" : "/signup"}>
          <button className="cta-btn">Get Started</button>
        </Link>
      </section>
    </div>
  );
};

export default About;
