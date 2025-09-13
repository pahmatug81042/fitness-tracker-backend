const Workout = require("../models/Workout");

// Create a new workout
exports.createWorkout = async (req, res) => {
    try {
        const { title, description } = req.body;
        const workout = new Workout({
            title,
            description,
            user: req.user._id, // set user from auth middleware
        });
        await workout.save();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create workout" });
    }
};

// Get all workouts for the logged-in user
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id });
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch workouts" });
    }
};

// Get single workout by ID (must belong to user)
exports.getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch workout" });
    }
};

// Add exercise to a workout
exports.addExercise = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!workout) {
            res.status(404).json({ erorr: "Workout not found" });
        }

        const { name, bodyPart, equipment, sets, reps, duration } = req.body.exercise || req.body;
        workout.exercises.push({ name, bodyPart, equipment, sets, reps, duration });
        await workout.save();
        res.json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add exercise" });
    }
};