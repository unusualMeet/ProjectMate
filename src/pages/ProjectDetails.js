import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);

  // Apply button / application status
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showFullDescription, setShowFullDescription] = useState(false);

  // Team / Contact section states
  const [teamData, setTeamData] = useState(null);
  const [canViewTeamSection, setCanViewTeamSection] = useState(false);
  const [teamLoading, setTeamLoading] = useState(true);

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProject();
    fetchTeamDetails();
    fetchApplicationStatus();
    // eslint-disable-next-line
  }, [id]);

  // =========================
  // Fetch project public details
  // =========================
  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Fetch protected team details
  // Visible only to owner / accepted members
  // =========================
  const fetchTeamDetails = async () => {
    if (!token) {
      setTeamLoading(false);
      setCanViewTeamSection(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/team`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setTeamData(data.team);
        setCanViewTeamSection(true);
      } else {
        setTeamData(null);
        setCanViewTeamSection(false);
      }
    } catch (error) {
      console.error(error);
      setTeamData(null);
      setCanViewTeamSection(false);
    } finally {
      setTeamLoading(false);
    }
  };

  // =========================
  // Fetch current user's application status for this project
  // =========================
  const fetchApplicationStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/status/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.hasApplied && data.application) {
          setApplied(true);
          setApplicationStatus(data.application.status);
        } else {
          setApplied(false);
          setApplicationStatus("");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Apply to project
  // =========================
  const applyToProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/apply/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            message: "I would like to join this project.",
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Applied Successfully");
        setMessageType("success");
        setApplied(true);
        setApplicationStatus("Pending");

        // refetch project after applying in case backend status changes later
        fetchProject();
      } else {
        setMessage(data.error || "Failed to apply");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
      setMessageType("error");
    }
  };

  if (!project) {
    return <div className="loading">Loading Project...</div>;
  }

  const isOwner = project.user?._id === currentUserId;
  const description = project.description || "";
  const previewLength = 260;
  const isLongDescription = description.length > previewLength;

  const displayedDescription = showFullDescription
    ? description
    : description.slice(0, previewLength) + (isLongDescription ? "..." : "");

  // =========================
  // TEAM FULL LOGIC
  // teamSize includes owner + accepted members
  // owner = 1
  // accepted members = project.members.length
  // =========================
  const currentTeamCount = 1 + (project.members?.length || 0);
  const isTeamFull = currentTeamCount >= project.teamSize;

  return (
    <div className="project-details-page">
      <div className="project-details-card">
        {message && (
          <div className={`custom-alert ${messageType}`}>{message}</div>
        )}

        <h1 className="project-title">{project.title}</h1>
        <span
          className={`project-status ${
            project.status?.toLowerCase() === "closed" ? "closed" : "open"
          }`}
        >
          {project.status}
        </span>

        <div className="content-grid">
          {/* LEFT SIDE */}
          <div className="left-content">
            <div className="section">
              <h3>Description</h3>

              <div className="project-description-box">
                <p className="project-description-text">
                  {displayedDescription}
                </p>

                {isLongDescription && (
                  <button
                    type="button"
                    className="view-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            </div>

            {/* Team / Contact Section */}
            {!teamLoading && canViewTeamSection && teamData && (
              <div className="section team-section">
                <h3>Team Members / Contact</h3>

                {/* Project Owner */}
                <div className="team-block">
                  <h4 className="team-subheading">Project Owner</h4>

                  <div className="member-card owner-card">
                    <div className="member-name-row">
                      <i className="fa-solid fa-crown"></i>
                      <span className="member-name">
                        {teamData.owner?.name || "Owner"}
                      </span>
                    </div>

                    <div className="member-details">
                      <p>
                        <i className="fa-solid fa-envelope"></i>
                        <span>{teamData.owner?.email || "Not provided"}</span>
                      </p>

                      <p>
                        <i className="fa-solid fa-code"></i>
                        <span>
                          {teamData.owner?.skills?.length > 0
                            ? teamData.owner.skills.join(", ")
                            : "Skills not added"}
                        </span>
                      </p>

                      <p>
                        <i className="fa-brands fa-github"></i>
                        <span>
                          {teamData.owner?.github || "GitHub not added"}
                        </span>
                      </p>

                      <p>
                        <i className="fa-brands fa-linkedin"></i>
                        <span>
                          {teamData.owner?.linkedin || "LinkedIn not added"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accepted Members */}
                <div className="team-block">
                  <h4 className="team-subheading">Accepted Members</h4>

                  {teamData.members && teamData.members.length > 0 ? (
                    <div className="team-members-list">
                      {teamData.members.map((member) => (
                        <div className="member-card" key={member._id}>
                          <div className="member-name-row">
                            <i className="fa-solid fa-user-group"></i>
                            <span className="member-name">{member.name}</span>
                          </div>

                          <div className="member-details">
                            <p>
                              <i className="fa-solid fa-envelope"></i>
                              <span>{member.email || "Not provided"}</span>
                            </p>

                            <p>
                              <i className="fa-solid fa-code"></i>
                              <span>
                                {member.skills?.length > 0
                                  ? member.skills.join(", ")
                                  : "Skills not added"}
                              </span>
                            </p>

                            <p>
                              <i className="fa-brands fa-github"></i>
                              <span>{member.github || "GitHub not added"}</span>
                            </p>

                            <p>
                              <i className="fa-brands fa-linkedin"></i>
                              <span>
                                {member.linkedin || "LinkedIn not added"}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-team-members">
                      No accepted members yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="right-content">
            <div className="section">
              <h3>Required Skills</h3>

              <div className="skills-container">
                {project.requiredSkills?.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Project Information</h3>

              <div className="info-grid">
                <div className="info-label">Created By :</div>
                <div className="info-value">
                  <i className="fa-solid fa-user"></i>
                  <span className="info-value-text">{project.user?.name}</span>
                </div>

                <div className="info-label">Email :</div>
                <div className="info-value">
                  <i className="fa-solid fa-envelope"></i>
                  <span className="info-value-text">{project.user?.email}</span>
                </div>

                <div className="info-label">Team Size :</div>
                <div className="info-value">
                  <i className="fa-solid fa-users"></i>
                  <span className="info-value-text">
                    {project.teamSize} Members
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action area */}
        {isOwner ? (
          <div className="owner-project-message">This is your project</div>
        ) : applied ? (
          applicationStatus === "Pending" ? (
            <div className="application-status-message pending-status">
              Application Pending
            </div>
          ) : applicationStatus === "Accepted" ? (
            <div className="application-status-message accepted-status">
              You are a team member of this project
            </div>
          ) : applicationStatus === "Rejected" ? (
            <div className="application-status-message rejected-status">
              Your application was not accepted for this project
            </div>
          ) : null
        ) : isTeamFull ? (
          <div className="application-status-message rejected-status">
            This project is full , So you can not apply for this project .
          </div>
        ) : (
          <button className="apply-btn" onClick={applyToProject}>
            Apply To Project
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
