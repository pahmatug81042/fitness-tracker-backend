const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        exercises: [
            {
                name: String,
                bodyPart: String,
                equipment: String,
                sets: Number,
                reps: Number,
                duration: Number,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);