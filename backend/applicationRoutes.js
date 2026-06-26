const express = require("express");
const router = express.Router();
const Application = require("./application");
const Project = require("./project");
const fetchuser = require("./fetchuser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const resumeDir = path.join(__dirname, "uploads", "resumes");

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});
// Apply to Project
router.post(
  "/apply/:projectId",
  fetchuser,
  upload.single("resume"),
  async (req, res) => {
    console.log("===== APPLY ROUTE STARTED =====");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    try {
      const project = await Project.findById(req.params.projectId);

      if (!project) {
        return res.status(404).json({
          error: "Project not found",
        });
      }

      // Prevent project owner from applying to their own project
      if (project.user.toString() === req.user.id) {
        return res.status(400).json({
          error: "You cannot apply to your own project",
        });
      }

      // Prevent applying if project is already closed
      if (project.status === "Closed") {
        return res.status(400).json({
          error: "This project is closed.",
        });
      }

      // total team count = owner + accepted members
      const currentTeamCount =
        1 + (project.members ? project.members.length : 0);

      // Prevent applying if project is already full
      if (currentTeamCount >= project.teamSize) {
        return res.status(400).json({
          error: "This project is full. Applications are closed.",
        });
      }

      // Prevent duplicate application
      const alreadyApplied = await Application.findOne({
        project: req.params.projectId,
        applicant: req.user.id,
      });

      if (alreadyApplied) {
        return res.status(400).json({
          error: "Already applied",
        });
      }
      // Prevent already accepted member from applying again
      const alreadyMember = project.members.some(
        (memberId) => memberId.toString() === req.user.id,
      );

      if (alreadyMember) {
        return res.status(400).json({
          error: "You are already a member of this project",
        });
      }

      // Resume is mandatory
      if (!req.file) {
        return res.status(400).json({
          error: "Resume is required.",
        });
      }
      console.log("Creating application...");
      console.log("Resume filename:", req.file.filename);
      const application = new Application({
        project: req.params.projectId,
        applicant: req.user.id,
        message: req.body.message || "I would like to join this project.",
        resume: req.file.filename,
        status: "Pending",
      });

      console.log("Application object:");
      console.log(application);

      await application.save();

      console.log("Application saved successfully");

      console.log("Updating project notification...");

      // mark project as having unread applications
      project.hasNewApplications = true;
      project.newApplicationsCount = (project.newApplicationsCount || 0) + 1;

      await project.save();

      console.log("Project updated successfully");

      console.log("Sending response...");

      return res.status(200).json({
        success: true,
        message: "Application submitted successfully",
      });
    } catch (error) {
      console.log("========== ERROR ==========");
      console.log(error);
      console.log(error?.message);
      console.log(error?.stack);
      console.log("===========================");

      return res.status(500).json({
        success: false,
        error: error?.message,
      });
    }
  },
);

// Get application status for current user on a project
router.get("/status/:projectId", fetchuser, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    const application = await Application.findOne({
      project: req.params.projectId,
      applicant: req.user.id,
    });

    if (!application) {
      return res.json({
        success: true,
        hasApplied: false,
        application: null,
      });
    }

    return res.json({
      success: true,
      hasApplied: true,
      application: {
        _id: application._id,
        status: application.status,
        message: application.message,
        project: application.project,
        applicant: application.applicant,
        date: application.date,
      },
    });
  } catch (error) {
    console.log(error);
    console.log(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// View applications of a project
router.get("/project/:projectId", fetchuser, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const applications = await Application.find({
      project: req.params.projectId,
    }).populate("applicant", "name email skills github linkedin");

    res.json(applications);
  } catch (error) {
    console.log(error);
    console.log(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// My applications
router.get("/myapplications", fetchuser, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    }).populate("project");

    res.json(applications);
  } catch (error) {
    console.log(error);
    console.log(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Accept application
router.put("/accept/:id", fetchuser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "project",
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    if (!application.project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    if (application.project.user.toString() !== req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (application.project.status === "Closed") {
      return res.status(400).json({
        error: "This project is already closed.",
      });
    }

    if (application.status === "Accepted") {
      return res.status(400).json({
        error: "Application already accepted",
      });
    }

    if (application.status === "Rejected") {
      return res.status(400).json({
        error: "Rejected application cannot be accepted",
      });
    }

    const currentTeamCount =
      1 +
      (application.project.members ? application.project.members.length : 0);

    if (currentTeamCount >= application.project.teamSize) {
      return res.status(400).json({
        error: "Team is already full. Cannot accept more members.",
      });
    }

    application.status = "Accepted";

    const alreadyMember = application.project.members.some(
      (memberId) => memberId.toString() === application.applicant.toString(),
    );

    if (!alreadyMember) {
      application.project.members.push(application.applicant);
    }

    await application.project.save();
    await application.save();

    const updatedTeamCount =
      1 +
      (application.project.members ? application.project.members.length : 0);

    // If team becomes full:
    // 1. Reject all pending applications
    // 2. Close the project
    if (updatedTeamCount >= application.project.teamSize) {
      await Application.updateMany(
        {
          project: application.project._id,
          status: "Pending",
        },
        {
          $set: { status: "Rejected" },
        },
      );

      application.project.status = "Closed";
      await application.project.save();
    }

    res.json(application);
  } catch (error) {
    console.log(error);
    console.log(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Reject application
router.put("/reject/:id", fetchuser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "project",
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    if (application.project.user.toString() !== req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (application.status === "Accepted") {
      return res.status(400).json({
        error: "Accepted application cannot be rejected",
      });
    }

    application.status = "Rejected";
    await application.save();

    res.json(application);
  } catch (error) {
    console.log("========== ERROR ==========");
    console.log(error);
    console.log(error.stack);
    console.log("===========================");

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete / Withdraw Application
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application deleted",
    });
  } catch (error) {
    console.log(error);
    console.log(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
