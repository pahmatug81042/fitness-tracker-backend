const express = require("express");
const router = express.Router();
const { searchExercises, searchVideos } = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

router.get("/search", protect, searchExercises);
router.get("/videos", protect, searchVideos);

module.exports = router;