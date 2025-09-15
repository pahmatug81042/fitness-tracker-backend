const Workout = require("../models/Workout");
const asyncHandler = require("express-async-handler");

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = asyncHandler(async (req, res) => {
    const { exerciseId, exerciseName, sets, reps, notes } = req.body;
    
    if (!exerciseId || !exerciseName) {
        res.status(400);
        throw new Error("Exercise ID and name are required");
    }

    const workout = await Workout.create({
        user: req.user.id,
        exerciseId,
        exerciseName,
        sets,
        reps,
        notes,
    });

    res.status(201).json(workout);
});

module.exports.createWorkout = createWorkout;

// @desc    Get all workouts for logged-in user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = (await Workout.find({ user: req.user.id })).toSorted({ createdAt: -1 });
    res.json(workouts);
});

module.exports.getWorkouts = getWorkouts;

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
        res.status(404);
        throw new Error("Workout not found");
    }

    // Ensure user owns the workout
    if (workout.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized");
    }

    const updateWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updateWorkout);
});

module.exports.updateWorkout = updateWorkout;