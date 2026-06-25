import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProject.css";

const CreateProject = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [project, setProject] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    teamSize: 4,
  });

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          requiredSkills: project.requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
          teamSize: Number(project.teamSize),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Project created successfully!");
        setMessageType("success");

        setProject({
          title: "",
          description: "",
          requiredSkills: "",
          teamSize: 4,
        });

        setTimeout(() => {
          navigate("/myprojects");
        }, 1800);
      } else {
        setMessage(data.error || "Failed to create project");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
      setMessageType("error");
    }
  };

  return (
    <div className="project-form-container">
      {message && (
        <div
          className={
            messageType === "success"
              ? "create-project-success"
              : "create-project-error"
          }
        >
          <div
            className={
              messageType === "success"
                ? "create-project-success-icon"
                : "create-project-error-icon"
            }
          >
            <i
              className={
                messageType === "success"
                  ? "fa-solid fa-circle-check"
                  : "fa-solid fa-circle-exclamation"
              }
            ></i>
          </div>

          <div
            className={
              messageType === "success"
                ? "create-project-success-content"
                : "create-project-error-content"
            }
          >
            <h4>
              {messageType === "success"
                ? "Project created successfully!"
                : "Unable to create project"}
            </h4>

            <p>
              {messageType === "success"
                ? "Your project is now live and visible to students for applications."
                : message}
            </p>
          </div>
        </div>
      )}

      <h1>Create New Project</h1>

      <p className="subtitle">
        Share your idea, find talented teammates, and build something amazing
        together.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={project.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Team Size</label>
            <input
              type="number"
              name="teamSize"
              value={project.teamSize}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Required Skills</label>
          <input
            type="text"
            name="requiredSkills"
            value={project.requiredSkills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="create-btn">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;