  const express = require("express");
  const router = express.Router();

  const Project = require("./project");
  const fetchuser = require("./fetchuser");

  // Create Project
  router.post("/create", fetchuser, async (req, res) => {
    try {
      const project = await Project.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        requiredSkills: req.body.requiredSkills,
        teamSize: req.body.teamSize,
      });

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Get All Projects
  router.get("/all", async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("user", "name email github linkedin skills")
        .sort({ date: -1 });

      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // =====================================================
  // Get total notification count for navbar
  // =====================================================
  router.get("/myprojects/notifications/count", fetchuser, async (req, res) => {
    try {
      const projects = await Project.find({ user: req.user.id });

      const totalNewApplications = projects.reduce((sum, project) => {
        return sum + (project.newApplicationsCount || 0);
      }, 0);

      res.json({
        success: true,
        totalNewApplications,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });

  // =====================================================
  // Get My Projects
  // When owner visits My Projects page:
  // - navbar badge count should disappear
  // - but project highlight should remain
  // =====================================================
  router.get("/myprojects", fetchuser, async (req, res) => {
    try {
      const projects = await Project.find({
        user: req.user.id,
      }).sort({ date: -1 });

      // reset ONLY navbar badge count
      await Project.updateMany(
        { user: req.user.id, newApplicationsCount: { $gt: 0 } },
        { $set: { newApplicationsCount: 0 } }
      );

      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });

  // =====================================================
  // Clear project highlight after owner opens applicants page
  // =====================================================
  router.put("/:id/clear-new-applications", fetchuser, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      if (project.user.toString() !== req.user.id) {
        return res.status(401).json({
          error: "Not Allowed",
        });
      }

      project.hasNewApplications = false;
      project.newApplicationsCount = 0;

      await project.save();

      res.json({
        success: true,
        message: "New application notification cleared",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });

  // ===============================
  // Get Team / Contact Details
  // Visible only to:
  // 1. Project owner
  // 2. Accepted members present in project.members
  // ===============================
  router.get("/:id/team", fetchuser, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate("user", "name email skills github linkedin")
        .populate("members", "name email skills github linkedin");

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      const loggedInUserId = req.user.id;
      const isOwner = project.user._id.toString() === loggedInUserId;

      const isAcceptedMember = project.members.some(
        (member) => member._id.toString() === loggedInUserId
      );

      if (!isOwner && !isAcceptedMember) {
        return res.status(403).json({
          success: false,
          error: "You are not authorized to view team details for this project",
        });
      }

      return res.json({
        success: true,
        isOwner,
        isAcceptedMember,
        team: {
          projectId: project._id,
          title: project.title,
          owner: project.user,
          members: project.members,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  });

  // Get Single Project
  router.get("/:id", async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate("user", "name email")
        .populate("members", "_id name email");

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Update Project
  router.put("/update/:id", fetchuser, async (req, res) => {
    try {
      let project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      if (project.user.toString() !== req.user.id) {
        return res.status(401).json({
          error: "Not Allowed",
        });
      }

      const { title, description, requiredSkills, teamSize, status } = req.body;

      const newProject = {};

      if (title) newProject.title = title;
      if (description) newProject.description = description;
      if (requiredSkills) newProject.requiredSkills = requiredSkills;
      if (teamSize) newProject.teamSize = teamSize;
      if (status) newProject.status = status;

      project = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: newProject },
        { new: true }
      );

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Delete Project
  router.delete("/delete/:id", fetchuser, async (req, res) => {
    try {
      let project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      if (project.user.toString() !== req.user.id) {
        return res.status(401).json({
          error: "Not Allowed",
        });
      }

      await Project.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  module.exports = router;