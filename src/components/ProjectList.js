import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import "./ProjectList.css";
import oopsimage from "../assets/oopsimage.png";
import oopsimagedark from "../assets/oopsimagedark.jpeg";

const ProjectList = ({ darkMode }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects/all");

      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="projects-page">
      <h1>Explore Projects</h1>

      {projects.length === 0 ? (
        <div className="empty-projects">
          <img
            src={darkMode ? oopsimagedark : oopsimage}
            alt="No Projects"
            className="oops-image"
          />

          <h2>No Projects Available Yet</h2>

          <p>
            Looks like nobody has posted a project yet.
            <br />
            Be the first one to start something amazing.
          </p>

          <Link to="/create-project" className="create-project-btn">
            + Create Project
          </Link>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
