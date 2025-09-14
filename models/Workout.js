const mongoose = require("mongoose");

// Define Workout schema
const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        exerciseId: {
            type: String, // ExerciseDB ID from RapidAPI
            required: true,
        },
        exerciseName: {
            type: String,
            required: true,
        },
        sets: {
            type: Number,
            default: 3,
        },
        reps: {
            type: Number,
            default: 10,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);