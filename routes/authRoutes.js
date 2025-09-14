// routes/authRoutes.js
const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route: Get current user
router.get("/me", protect, getMe);

module.exports = router;