const express = require("express");
const router = express.Router();
const {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
} = require("../controllers/workoutController");

const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.route("/")
    .post(protect, createWorkout)
    .get(protect, getWorkouts);

router.route("/:id")
    .put(protect, updateWorkout)
    .delete(protect, deleteWorkout);

module.exports = router;