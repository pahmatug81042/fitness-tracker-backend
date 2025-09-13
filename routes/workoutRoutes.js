const express = require("express");
const {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
} = require("../controllers/workoutController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getWorkouts).post(protect, createWorkout);
router.route("/:id").put(protect, updateWorkout).delete(protect, deleteWorkout);

module.exports = router;