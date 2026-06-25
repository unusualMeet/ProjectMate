import React, { useEffect, useState } from "react";
import "./MyApplications.css";
import oops2 from "../assets/oops2.png";
import oops2dark from "../assets/oops2dark.jpeg";
import { Link } from "react-router-dom";

const MyApplications = ({ darkMode }) => {
  const [applications, setApplications] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const toggleDescription = (applicationId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [applicationId]: !prev[applicationId],
    }));
  };

  const deleteApplication = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setApplications((prev) =>
          prev.filter((application) => application._id !== id),
        );
      } else {
        alert(data.error || "Failed to withdraw application");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/applications/myapplications",
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error(error);
      setApplications([]);
    }
  };

  return (
    <div className="applications-page">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <div className="empty-applications">
          <img
            src={darkMode ? oops2dark : oops2}
            alt="No Applications"
            className="oops2-image"
          />

          <h2>Oops!</h2>

          <p>
            You haven't applied to any projects yet.
            <br />
            Explore projects and start collaborating.
          </p>

          <Link to="/projects" className="explore-projects-btn">
            Explore Projects
          </Link>
        </div>
      ) : (
        <div className="applications-grid">
          {applications
            .filter((application) => application.project)
            .map((application) => {
              const description = application.project?.description || "";
              const isExpanded = expandedCards[application._id] || false;

              return (
                <div className="application-card" key={application._id}>
                  <h2 style={{ paddingRight: "120px" }}>
                    {application.project?.title || "Untitled Project"}
                  </h2>

                  <div className="application-description-wrapper">
                    <p
                      className={`application-description ${
                        isExpanded ? "expanded" : "collapsed"
                      }`}
                    >
                      {description}
                    </p>

                    {description.length > 180 && (
                      <button
                        type="button"
                        className="view-more-btn"
                        onClick={() => toggleDescription(application._id)}
                      >
                        {isExpanded ? "View Less" : "View More"}
                      </button>
                    )}
                  </div>

                  <div className={`status ${application.status.toLowerCase()}`}>
                    {application.status}
                  </div>

                  <small>
                    Applied On: {new Date(application.date).toLocaleDateString()}
                  </small>

                  {application.status === "Pending" && (
                    <button
                      className="delete-application-btn"
                      onClick={() => deleteApplication(application._id)}
                    >
                      Withdraw Application
                    </button>
                  )}

                  {application.status === "Rejected" && (
                    <div className="application-feedback rejected-feedback">
                      <h4>Don’t give up 💪</h4>
                      <p>
                        This application wasn’t accepted, but the right project
                        is still waiting for you. Keep exploring, keep applying,
                        and keep building.
                      </p>
                    </div>
                  )}

                  {application.status === "Accepted" && (
                    <div className="application-feedback accepted-feedback">
                      <h4>Congratulations 🎉</h4>
                      <p>
                        Your application has been accepted. You’re now part of
                        this project team — collaborate well and build something
                        amazing together.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;