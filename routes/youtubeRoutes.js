const express = require("express");
const router = express.Router();
const { searchVideos } = require("../controllers/youtubeController");
const { protect } = require("../middleware/authMiddleware");

// Protected route: only logged-in users can search
router.get("/search", protect, searchVideos);

module.exports = router;