const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createWorkout,
    getWorkouts,
    addExercise,
} = require("../controllers/workoutController");

router.route("/").post(protect, createWorkout).get(protect, getWorkouts);
router.route("/:id/addExercises").post(protect, addExercise);

module.exports = router;