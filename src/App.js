import React, { useState, useEffect } from "react";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MyProjects from "./pages/MyProjects";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProject from "./components/CreateProject";
import About from "./pages/About";
import ProjectList from "./components/ProjectList";
import "./App.css";
import EditProject from "./components/EditProject";
import Profile from "./pages/Profile";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectApplicants from "./pages/ProjectApplicants";
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  useEffect(() => {
    document.body.className = darkMode ? "dark-theme" : "light-theme";

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-project/:id"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectList darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myprojects"
          element={
            <ProtectedRoute>
              <MyProjects darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myapplications"
          element={
            <ProtectedRoute>
              <MyApplications darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id/applicants"
          element={
            <ProtectedRoute>
              <ProjectApplicants darkMode={darkMode} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
