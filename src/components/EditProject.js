import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateProject.css";
import "./EditProject.css";

const EditProject = ({ showAlert }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    teamSize: "",
  });

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`);

      const data = await response.json();

      setProject({
        title: data.title || "",
        description: data.description || "",
        requiredSkills: data.requiredSkills
          ? data.requiredSkills.join(", ")
          : "",
        teamSize: data.teamSize || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            title: project.title,
            description: project.description,
            requiredSkills: project.requiredSkills
              .split(",")
              .map((skill) => skill.trim()),
            teamSize: project.teamSize,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Project updated successfully");
        setMessageType("success");
        setTimeout(() => {
          navigate("/myprojects");
        }, 1500);
      } else {
        alert(data.error || "Failed to update project");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="create-project-page">
      {message && (
        <div className={`custom-alert ${messageType}`}>{message}</div>
      )}
      <div className="create-project-container">
        <h1>Edit Project</h1>

        <p>
          Update your project details and keep your team requirements up to
          date.
        </p>

        <form onSubmit={handleUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label>Project Title</label>

              <input
                type="text"
                name="title"
                value={project.title}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Team Size</label>

              <input
                type="number"
                name="teamSize"
                value={project.teamSize}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Required Skills</label>

            <input
              type="text"
              name="requiredSkills"
              value={project.requiredSkills}
              onChange={onChange}
              placeholder="React, Node.js, MongoDB"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={project.description}
              onChange={onChange}
              rows="4"
              required
            />
          </div>

          <button type="submit" className="create-btn">
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
