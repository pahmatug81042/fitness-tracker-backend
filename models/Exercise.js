const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        apiExerciseId: {
            type: String,
            required: true, // ID from RapidAPI ExerciseDB
        },
        name: {
            type: String,
            required: true,
        },
        bodyPart: String,
        target: String,
        equipment: String,
        additionalNotes: String, // for user-added notes
    },
    { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);