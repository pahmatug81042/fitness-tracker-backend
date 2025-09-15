const asyncHandler = require("express-async-handler");
const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");

// @desc    Get all workouts for logged-in users
// @route   GET /api/workouts
// @access  Private
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ user: req.user.id }).populate("exercises");
    res.json(workouts);
});

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = asyncHandler (async (req, res) => {
    const { name, exercises } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("Workout name is required");
    }

    const workout = await Workout.create({
        user: req.user.id,
        name,
        exercises: exercises || [],
    });

    res.status(201).json(workout);
});

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        res.status(404);
        throw new Error("Workout not found");
    }

    if (workout.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized");
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        res.status(404);
        throw new Error("Workout not found");
    }

    if (workout.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized");
    }

    await workout.deleteOne();
    res.json({ message: "Workout removed" });
});

module.exports = {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
};