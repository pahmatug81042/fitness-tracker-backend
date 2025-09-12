const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        exercises: [
            {
                name: {
                    type: String,
                    required: true
                },
                bodyPart: {
                    type: String
                },
                equipment: {
                    type: String
                },
                sets: {
                    type: Number
                },
                reps: {
                    type: Number
                },
                duration: {
                    type: Number
                },
            },
        ],
        data: {
            type: Date,
            default: Date.now
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);