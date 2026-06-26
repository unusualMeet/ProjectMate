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
  const [createdProjects, setCreatedProjects] = useState([]);
  const [formData, setFormData] = useState({
    college: "",
    branch: "",
    year: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: "",
    interests: [],
    availability: "Available",
    experience: "Beginner",
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
      setCreatedProjects(Array.isArray(projectsData) ? projectsData : []);
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
        interests: userData.interests || [],
        availability: userData.availability || "Available",
        experience: userData.experience || "Beginner",
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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
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

            interests: formData.interests,

            availability: formData.availability,

            experience: formData.experience,
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

          interests: updatedUser.interests || [],

          availability: updatedUser.availability || "Available",

          experience: updatedUser.experience || "Beginner",
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
  const userInterests =
    profile.interests && profile.interests.length > 0 ? profile.interests : [];

  const userAvailability = profile.availability || "Available";

  const userExperience = profile.experience || "Beginner";

  const experienceStars = {
    Beginner: "⭐ Beginner",
    Intermediate: "⭐⭐ Intermediate",
    Advanced: "⭐⭐⭐ Advanced",
  };
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
                    type="string"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter your admission year"
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
                  <label>Interests</label>

                  <div className="interest-grid">
                    {[
                      "Web Development",
                      "AI/ML",
                      "App Development",
                      "Cyber Security",
                      "UI/UX",
                      "Data Science",
                      "Cloud Computing",
                      "DevOps",
                      "Blockchain",
                    ].map((interest) => (
                      <label key={interest} className="interest-option">
                        <input
                          type="checkbox"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleInterestChange}
                        />

                        <span className="interest-text">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="profile-form-group full-width">
                  <label>Availability</label>

                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="availability"
                        value="Available"
                        checked={formData.availability === "Available"}
                        onChange={handleChange}
                      />
                      <span className="availability-badge available">
                        Available for Projects
                      </span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="availability"
                        value="Busy"
                        checked={formData.availability === "Busy"}
                        onChange={handleChange}
                      />
                      <span className="availability-badge busy">
                        Currently Busy
                      </span>
                    </label>
                  </div>
                </div>
                <div className="profile-form-group full-width">
                  <label>Experience Level</label>

                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="experience"
                        value="Beginner"
                        checked={formData.experience === "Beginner"}
                        onChange={handleChange}
                      />
                      Beginner
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="experience"
                        value="Intermediate"
                        checked={formData.experience === "Intermediate"}
                        onChange={handleChange}
                      />
                      Intermediate
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="experience"
                        value="Advanced"
                        checked={formData.experience === "Advanced"}
                        onChange={handleChange}
                      />
                      Advanced
                    </label>
                  </div>
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
        {/* ABOUT + PROFESSIONAL INFO */}

        <div className="profile-content-grid">
          <div className="profile-section">
            <h3>About Me</h3>

            <p>{userBio}</p>
          </div>

          <div className="profile-section">
            <h3>Professional Information</h3>

            <div className="professional-grid">
              {/* Skills */}

              <div className="professional-box">
                <h4>Skills</h4>

                <div className="skills-container">
                  {userSkills.length > 0 ? (
                    userSkills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))
                  ) : (
                    <p>No skills added.</p>
                  )}
                </div>
              </div>

              {/* Interests */}

              <div className="professional-box">
                <h4>Interests</h4>

                <div className="skills-container">
                  {userInterests.length > 0 ? (
                    userInterests.map((interest, index) => (
                      <span key={index}>{interest}</span>
                    ))
                  ) : (
                    <p>No interests added.</p>
                  )}
                </div>
              </div>

              {/* Availability */}

              <div className="professional-box">
                <h4>Availability</h4>

                <div
                  className={`availability-badge ${
                    userAvailability === "Available" ? "available" : "busy"
                  }`}
                >
                  {userAvailability === "Available"
                    ? "Available for Projects"
                    : "Currently Busy"}
                </div>
              </div>

              {/* Experience */}

              <div className="professional-box">
                <h4>Experience</h4>

                <p>{experienceStars[userExperience]}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-section">
          <h3>Projects Created</h3>

          {createdProjects.length > 0 ? (
            <ul className="projects-created-list">
              {createdProjects.map((project) => (
                <li key={project._id}>{project.title}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-profile-text">No projects created yet.</p>
          )}
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
