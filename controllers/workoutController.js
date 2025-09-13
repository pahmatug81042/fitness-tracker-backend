const Workout = require("../models/Workout");

// Create a new workout
exports.createWorkout = async (req, res) => {
    const { title, description } = req.body;
    try {
        const workout = await Workout.create({
            title,
            description,
            user: req.user._id,
            exercises: [],
        });
        res.status(201).json(workout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all workouts for user
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add exercises to a workout
exports.addExercise = async (req, res) => {
    const { exercise } = req.body;
    const workoutId = req.params.id;

    try {
        const workout = await Workout.findById(workoutId);

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }
        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to modify this workout" });
        }

        workout.exercises.push(exercise);
        await workout.save();
        res.json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};