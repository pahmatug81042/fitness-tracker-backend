const express = require("express");
const router = express.Router();
const { searchExercises, searchVideos } = require("../controllers/exerciseController");

router.get("/search", searchExercises);
router.get("/videos", searchVideos);

module.exports = router;