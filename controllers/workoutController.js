const Workout = require('../models/Workout');

// Create a workout
exports.createWorkout = async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    try {
        const workout = await Workout.create({ title, user: req.user.id });
        res.status(201).json(workout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all workouts for user
exports.getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single workout by ID
exports.getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ message: "Workout not found" });
        res.json(workout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add exercise to workout
exports.addExercise = async (req, res) => {
    const workoutId = req.params.id;
    const { exercise } = req.body;

    if (!exercise || !exercise.name) {
        return res.status(400).json({ message: 'Exercise data is required' });
    }

    try {
        const workout = await Workout.findById(workoutId);
        if (!workout) return res.status(404).json({ message: 'Workout not found' });

        const newExercise = {
            name: exercise.name,
            bodyPart: exercise.bodyPart || '',
            equipment: exercise.equipment || '',
            sets: exercise.sets || 0,
            reps: exercise.reps || 0,
            duration: exercise.duration || 0
        };

        workout.exercises.push(newExercise);
        await workout.save();

        res.status(201).json({ message: 'Exercise added', exercises: workout.exercises });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};