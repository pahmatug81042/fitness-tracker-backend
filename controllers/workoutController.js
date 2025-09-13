const Workout = require("../models/Workout");

// Get all workouts for logged-in user
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user._id });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new workout
const createWorkout = async (req, res) => {
    const { title, description, exercises } = req.body;
    try {
        const workout = await Workout.create({
            user: req.user._id,
            title,
            description,
            exercises,
        });
        res.status(201).json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update workout
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }
        if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        Object.assign(workout, req.body);
        const updatedWorkout = await Workout.save();
        res.json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete workout
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await workout.deleteOne();
        res.jsonO({ message: "Workout removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getWorkouts, createWorkout, updateWorkout, deleteWorkout };