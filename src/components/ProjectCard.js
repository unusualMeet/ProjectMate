import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProjectList.css";

const ProjectCard = ({ project }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const description = project.description || "";
  const previewLength = 180;
  const isLongDescription = description.length > previewLength;

  const displayedDescription = showFullDescription
    ? description
    : description.slice(0, previewLength) + (isLongDescription ? "..." : "");

  return (
    <div className="project-card">
      <h2>{project.title}</h2>

      <div className="project-description-box">
        <p className="project-card-description">{displayedDescription}</p>

        {isLongDescription && (
          <button
            type="button"
            className="view-more-btn"
            onClick={() => setShowFullDescription(!showFullDescription)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              padding: "0",
              marginTop: "-10px",
              color: "#10b981",
              fontSize: "1rem",
              fontWeight: "600",
              fontFamily: "inherit",
              cursor: "pointer",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            {showFullDescription ? "View Less" : "View More"}
          </button>
        )}
      </div>

      <div className="skills">
        {project.requiredSkills?.map((skill, index) => (
          <span key={index}>{skill}</span>
        ))}
      </div>

      <div className="project-info">
        <p>Created By: {project.user?.name}</p>
        <p>Team Size: {project.teamSize}</p>
      </div>

      <Link to={`/project/${project._id}`} className="view-btn">
        View Details
      </Link>
    </div>
  );
};

export default ProjectCard;
