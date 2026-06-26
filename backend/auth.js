const express = require("express");
const router = express.Router();
const User = require("./user");
const fetchuser = require("./fetchuser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const JWT_SECRET = "ProjectMateSecretKey";
// CREATE USER
router.post(
  "/createuser",
  [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({
        success: true,
        authtoken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
);
// LOGIN
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Invalid Credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "Invalid Credentials",
        });
      }
      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({
        success: true,
        authtoken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
);
// GET LOGGED IN USER
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// UPDATE PROFILE
router.put("/updateprofile", fetchuser, async (req, res) => {
  try {
    const {
      college,
      branch,
      year,
      bio,
      github,
      linkedin,
      skills,
      interests,
      availability,
      experience,
    } = req.body;
    const newProfile = {};
    if (college) newProfile.college = college;
    if (branch) newProfile.branch = branch;
    if (year) newProfile.year = year;
    if (bio) newProfile.bio = bio;
    if (github) newProfile.github = github;
    if (linkedin) newProfile.linkedin = linkedin;
    if (skills) newProfile.skills = skills;
    if (interests) newProfile.interests = interests;
    if (availability) newProfile.availability = availability;
    if (experience) newProfile.experience = experience;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: newProfile },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// SEARCH USERS BY SKILL
router.get("/search", async (req, res) => {
  try {
    const skill = req.query.skill;
    const users = await User.find({
      skills: {
        $regex: skill,
        $options: "i",
      },
    }).select("-password");
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
