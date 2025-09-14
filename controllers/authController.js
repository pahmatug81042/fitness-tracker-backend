// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        message: "Login successful",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

module.exports = { registerUser, loginUser, getMe };