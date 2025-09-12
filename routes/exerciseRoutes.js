const express = require("express");
const { searchExercises, getExerciseVideos } = require("../controllers/exerciseController");

const router = express.Router();

router.get("/search", searchExercises);
router.get("/videos", getExerciseVideos);

module.exports = router;