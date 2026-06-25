import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import homeimage from "../assets/homeimage.png";
import darkhome from "../assets/darkhome.png";
import { Link } from "react-router-dom";
const Dashboard = ({ darkMode }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects/all");

      const data = await response.json();

      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* info about the app */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${darkMode ? darkhome : homeimage})`,
        }}
      >
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-handshake"></i>Student Collaboration
            Platform
          </div>

          <h1>
            Build Projects With
            <br />
            The Right Team
          </h1>

          <p>
            Discover innovative projects, connect with talented teammates, and
            turn ideas into real-world products.
          </p>

          <div className="hero-buttons">
            <Link to="/create-project" className="btn-primary">
              Create Project
            </Link>

            <Link to="/projects" className="btn-secondary">
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Next Sections */}

      <section className="stats-section">
        <div className="container my-3">
          <h2>Why ProjectMate?</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>500+</h3>
              <p>Projects Created</p>
            </div>

            <div className="stat-card">
              <h3>1000+</h3>
              <p>Students Connected</p>
            </div>

            <div className="stat-card">
              <h3>200+</h3>
              <p>Teams Formed</p>
            </div>
          </div>
        </div>
      </section>
      {/* Welcome Section */}
      <div className="dashboard-header">
        <h1>Code , Collaborate , Create. </h1>
        <p>
          Connect with talented students, build innovative projects, and grow
          your development skills together.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid-2">
        <div className="stat-card">
          <h3>{projects.length}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card">
          <h3>∞</h3>
          <p>Opportunities</p>
        </div>
        <div className="stat-card">
          <h3>
            <i className="fa-solid fa-users-rectangle"></i>
          </h3>
          <p>Team Building</p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="projects-section">
        <h2>Recent Projects</h2>

        {loading ? (
          <h3>Loading Projects...</h3>
        ) : projects.length === 0 ? (
          <h3>No Projects Found</h3>
        ) : (
          <div className="projects-grid">
            {[...projects]
              .reverse()
              .slice(0, 2)
              .map((project) => (
                <div className="project-card" key={project._id}>
                  <h3>{project.title}</h3>

                  <p className="project-description">{project.description}</p>

                  <p>
                    <strong>Skills:</strong> {project.requiredSkills}
                  </p>

                  <p>
                    <strong>Team Size:</strong> {project.teamSize}
                  </p>

                  <p>
                    <strong>Created By:</strong> {project.user?.name}
                  </p>

                  <Link to={`/project/${project._id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
