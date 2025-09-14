const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const { protect } = require("../middleware/authMiddleware");

// Create a workout
router.post("/", protect, workoutController.createWorkout);

// Get all workouts for user
router.get("/", protect, workoutController.getWorkouts);

// Get a single workout by ID
router.get("/:id", protect, workoutController.getWorkoutById);

// Add exercise to workout
router.post("/:id/addExercise", protect, workoutController.addExercise);

module.exports = router;