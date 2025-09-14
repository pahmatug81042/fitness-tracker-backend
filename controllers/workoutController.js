const Workout = require('../models/Workout');

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

        // Add sets/reps/duration
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