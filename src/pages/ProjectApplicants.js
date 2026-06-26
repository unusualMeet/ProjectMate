import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProjectApplicants.css";
import oopsimage from "../assets/oopsimage.png";
import oopsimagedark from "../assets/oopsimagedark.jpeg";

const ProjectApplicants = ({ darkMode }) => {
  const { id } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/project/${id}`,
        {
          headers: {
            "auth-token": sessionStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();

      setApplicants(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleAccept = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/accept/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "auth-token": sessionStorage.getItem("token"),
          },
        },
      );

      if (response.ok) {
        fetchApplicants();
      } else {
        alert("Failed to accept application");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/reject/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "auth-token": sessionStorage.getItem("token"),
          },
        },
      );

      if (response.ok) {
        fetchApplicants();
      } else {
        alert("Failed to reject application");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <h2 className="loading-text">Loading Applicants...</h2>;
  }

  return (
    <div className="container applicants-page">
      <h1>Project Applicants</h1>

      {applicants.length === 0 ? (
        <div className="empty-applicants">
          <img
            src={darkMode ? oopsimagedark : oopsimage}
            alt="No Applicants"
            className="oops-image"
          />

          <h2>No Applications Yet</h2>

          <p>
            Applicants will appear here once students start applying to your
            project.
          </p>
        </div>
      ) : (
        <div className="applicants-grid">
          {applicants.map((app) => (
            <div key={app._id} className="applicant-card">
              <div className="applicant-header">
                <div className="avatar">
                  {app.applicant?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3>{app.applicant?.name}</h3>
                  <p>{app.applicant?.email}</p>
                </div>
              </div>

              <p>
                <strong>Email:</strong> {app.applicant?.email}
              </p>

              <p className="applicant-message-label">Message:</p>
              <p className="applicant-message">{app.message}</p>
              {/* Resume */}
              {app.resume && (
                <a
                  href={`http://localhost:5000/uploads/resumes/${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-btn"
                >
                  📄 View Resume
                </a>
              )}  
              <span className={`status-badge ${app.status.toLowerCase()}`}>
                {app.status}
              </span>

              {app.status === "Pending" && (
                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(app._id)}
                  >
                    Accept
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(app._id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectApplicants;
