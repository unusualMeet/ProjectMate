import React, { useEffect, useState } from "react";
import "./MyProjects.css";
import { Link } from "react-router-dom";
import createproject from "../assets/createproject.png";
import createprojectdark from "../assets/createprojectdark.jpeg";

const MyProjects = ({ darkMode, setNotificationCount }) => {
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects/myprojects",
        {
          headers: {
            "auth-token": sessionStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      setProjects(data);
      setNotificationCount(0); // remove navbar badge once owner opens My Projects
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDescription = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleApplicantsClick = async (projectId) => {
    try {
      await fetch(
        `http://localhost:5000/api/projects/${projectId}/clear-new-applications`,
        {
          method: "PUT",
          headers: {
            "auth-token": sessionStorage.getItem("token"),
          },
        }
      );

      // instantly remove highlight from clicked project in UI
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, hasNewApplications: false }
            : project
        )
      );
    } catch (error) {
      console.error("Failed to clear project notification:", error);
    }
  };

  return (
    <div className="my-projects-page">
      <h1>Your innovative projects!</h1>

      {projects.length === 0 ? (
        <div className="empty-projects">
          <img
            src={darkMode ? createprojectdark : createproject}
            alt="Create Project"
            className="create-project-image"
          />

          <h2>Bring Your Ideas To Life</h2>

          <p>
            You haven't created any projects yet.
            <br />
            Start a new project and find talented teammates to collaborate with.
          </p>

          <Link to="/create-project" className="create-project-btn">
            + Create Project
          </Link>
        </div>
      ) : (
        <div className="my-projects-grid">
          {projects.map((project) => {
            const description = project.description || "";
            const previewLength = 180;
            const isExpanded = expandedProjects[project._id];
            const isLongDescription = description.length > previewLength;

            const displayedDescription = isExpanded
              ? description
              : description.slice(0, previewLength) +
                (isLongDescription ? "..." : "");

            return (
              <div
                className={`my-project-card ${
                  project.hasNewApplications
                    ? "project-has-new-applications"
                    : ""
                }`}
                key={project._id}
              >
                <div className="project-card-top-row">
                  <div className="status-badge">● {project.status}</div>

                  {project.hasNewApplications && (
                    <div className="new-applications-pill">
                      New Applications
                    </div>
                  )}
                </div>

                <div className="project-top">
                  <div className="project-content">
                    <h2 className="project-title">{project.title}</h2>

                    {project.hasNewApplications && (
                      <div className="new-request-text">
                        New request received for this project
                      </div>
                    )}

                    <div className="project-description-box">
                      <p className="project-description">
                        {displayedDescription}
                      </p>

                      {isLongDescription && (
                        <button
                          type="button"
                          className="view-more-btn"
                          onClick={() => toggleDescription(project._id)}
                        >
                          {isExpanded ? "View Less" : "View More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-bottom">
                  <div className="skills-container">
                    {project.requiredSkills?.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="project-meta">Team Size: {project.teamSize}</p>
                </div>

                <div className="project-actions">
                  <Link
                    to={`/edit-project/${project._id}`}
                    className="edit-btn"
                  >
                    Edit Project
                  </Link>

                  <Link
                    to={`/project/${project._id}/applicants`}
                    className={`applicants-btn ${
                      project.hasNewApplications
                        ? "applicants-btn-highlight"
                        : ""
                    }`}
                    onClick={() => handleApplicantsClick(project._id)}
                  >
                    {project.hasNewApplications
                      ? "View New Applicants"
                      : "View Applicants"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProjects;