import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    projectsCreated: 0,
    applications: 0,
    teamsJoined: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    college: "",
    branch: "",
    year: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: "",
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line
  }, []);

  const fetchProfileData = async () => {
    try {
      const userResponse = await fetch(
        "http://localhost:5000/api/auth/getuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const userData = await userResponse.json();
      const projectsResponse = await fetch(
        "http://localhost:5000/api/projects/myprojects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const projectsData = await projectsResponse.json();
      const applicationsResponse = await fetch(
        "http://localhost:5000/api/applications/myapplications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        },
      );

      const applicationsData = await applicationsResponse.json();

      const projectsCount = Array.isArray(projectsData)
        ? projectsData.length
        : 0;
      const applicationsCount = Array.isArray(applicationsData)
        ? applicationsData.length
        : 0;
      const teamsJoinedCount = Array.isArray(applicationsData)
        ? applicationsData.filter((app) => app.status === "Accepted").length
        : 0;

      setProfile(userData);

      setFormData({
        college: userData.college || "",
        branch: userData.branch || "",
        year: userData.year || "",
        bio: userData.bio || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
        skills: Array.isArray(userData.skills)
          ? userData.skills.join(", ")
          : "",
      });

      setStats({
        projectsCreated: projectsCount,
        applications: applicationsCount,
        teamsJoined: teamsJoinedCount,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/updateprofile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            college: formData.college,
            branch: formData.branch,
            year: formData.year,
            bio: formData.bio,
            github: formData.github,
            linkedin: formData.linkedin,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),
          }),
        },
      );

      const updatedUser = await response.json();

      if (response.ok) {
        setProfile(updatedUser);
        setIsEditing(false);

        setFormData({
          college: updatedUser.college || "",
          branch: updatedUser.branch || "",
          year: updatedUser.year || "",
          bio: updatedUser.bio || "",
          github: updatedUser.github || "",
          linkedin: updatedUser.linkedin || "",
          skills: Array.isArray(updatedUser.skills)
            ? updatedUser.skills.join(", ")
            : "",
        });
      } else {
        console.error(updatedUser.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  if (!profile) {
    return <div className="profile-loading">Failed to load profile.</div>;
  }

  const userName = profile.name || "Student";
  const userEmail = profile.email || "No email added";
  const userBranch = profile.branch || "Student";
  const userCollege = profile.college || "College not added";
  const userYear = profile.year || "Year not added";
  const userBio =
    profile.bio ||
    "No bio added yet. Update your profile to tell others about yourself.";
  const userSkills =
    profile.skills && profile.skills.length > 0 ? profile.skills : [];

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        {/* HEADER CARD */}
        <div className="profile-top-card">
          <div className="profile-top-left">
            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-user-info">
              <h2>{userName}</h2>
              <p>{userEmail}</p>
              <span>{userBranch}</span>
            </div>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Close Edit" : "Edit Profile"}
            <span> </span>
            <i
              className={`fa-solid ${isEditing ? "fa-xmark" : "fa-pen"} edit-profile-icon`}
            ></i>
          </button>
        </div>

        {/* PROFILE DETAILS CARD */}
        <div className="profile-info-strip">
          <div className="profile-mini-info">
            <h4>College</h4>
            <p>{userCollege}</p>
          </div>
          <div className="profile-mini-info">
            <h4>Branch</h4>
            <p>{userBranch}</p>
          </div>
          <div className="profile-mini-info">
            <h4>Year</h4>
            <p>{userYear}</p>
          </div>
        </div>

        {/* EDIT FORM */}
        {isEditing && (
          <div className="profile-section edit-section">
            <div className="section-header-row">
              <h3>Edit Profile</h3>
              <p>Update your personal details, links and skills.</p>
            </div>

            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="profile-form-grid">
                <div className="profile-form-group">
                  <label>College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Enter your college"
                  />
                </div>

                <div className="profile-form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Enter your branch"
                  />
                </div>

                <div className="profile-form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter your year"
                  />
                </div>

                <div className="profile-form-group">
                  <label>GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="Enter GitHub link"
                  />
                </div>

                <div className="profile-form-group">
                  <label>LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="Enter LinkedIn link"
                  />
                </div>

                <div className="profile-form-group full-width">
                  <label>Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Example: React, Node.js, MongoDB"
                  />
                </div>

                <div className="profile-form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    rows="5"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others about yourself"
                  />
                </div>
              </div>

              <div className="profile-form-actions">
                <button type="submit" className="save-profile-btn">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ABOUT + SKILLS */}
        <div className="profile-content-grid">
          <div className="profile-section">
            <h3>About</h3>
            <p>{userBio}</p>
          </div>

          <div className="profile-section">
            <h3>Skills</h3>
            <div className="skills-container">
              {userSkills.length > 0 ? (
                userSkills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))
              ) : (
                <p className="empty-profile-text">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="profile-stats">
          <div className="profile-stat">
            <h4>{stats.projectsCreated}</h4>
            <p>Projects Created</p>
          </div>

          <div className="profile-stat">
            <h4>{stats.applications}</h4>
            <p>Applications</p>
          </div>

          <div className="profile-stat">
            <h4>{stats.teamsJoined}</h4>
            <p>Teams Joined</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
