const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a workout
router.post("/", authMiddleware, workoutController.createWorkout);

// Get all workouts for user
router.get("/", authMiddleware, workoutController.getWorkouts);

// Get a single workout by ID
router.get("/:id", authMiddleware, workoutController.getWorkoutById);

// Add exercise to workout
router.post("/:id/addExercise", authMiddleware, workoutController.addExercise);