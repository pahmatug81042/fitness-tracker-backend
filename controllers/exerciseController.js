const asyncHandler = require("express-async-handler");
const Exercise = require("../models/Exercise");
const fetch = require("node-fetch");
require("dotenv").config();

// RapidAPI headers
const exerciseOptions = {
    method: "GET",
    headers: {
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    },
};

const youtubeOptions = {
    method: "GET",
    headers: {
        "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    },
};

// -------------------- Fetch Exercises from ExerciseDB --------------------
const fetchExercises = asyncHandler(async (req, res) => {
    // Fetch all exercises
    const url = "https://exercisedb.p.rapidapi.com/exercises";
    const response = await fetch(url, exerciseOptions);
    const data = await response.json();

    // Extract unique bodyParts for frontend filter
    const bodyParts = Array.from(new Set(data.map((ex) => ex.bodyPart)));

    res.json({ exercises: data, bodyParts });
});

// -------------------- Add Exercise to User's List --------------------
const addExercise = asyncHandler(async (req, res) => {
    const { apiExerciseId, name, bodyPart, target, equipment, additionalNotes } = req.body;

    if (!apiExerciseId || !name) {
        res.status(400);
        throw new Error("Exercise ID and name are required");
    }

    const exercise = await Exercise.create({
        user: req.user._id,
        apiExerciseId,
        name,
        bodyPart,
        target,
        equipment,
        additionalNotes,
    });

    res.json(201).json(exercise);
});

// -------------------- Get All User Exercises --------------------
const getExercises = asyncHandler(async (req, res) => {
    const exercises = await Exercise.find({ user: req.user._id });
    res.json(exercises);
});

// -------------------- Get Single Exercise by ID --------------------
const getExerciseById = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not found");
    }

    // Fetch YouTube videos related to the exercise
    const youtubeUrl = `https://youtube-search-and-download.p.rapidapi.com/search?query=${exercise.name} exercise`;
    const youtubeRes = await fetch(youtubeUrl, youtubeOptions);
    const youtubeData = await youtubeRes.json();

    res.json({ exercise, youtubeVideos: youtubeData.contents });
});

// -------------------- Update Exercise --------------------
const updateExercise = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not found");
    }

    Object.assign(exercise, req.body);
    const updatedExercise = await exercise.save();
    res.json(updatedExercise);
});

// -------------------- Delete Exercise --------------------
const deleteExercise = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!exercise) {
        res.status(404);
        throw new Error("Exercise not found");
    }

    await exercise.deleteOne();
    res.json({ message: "Exercise removed" });
});

module.exports = {
    fetchExercises,
    addExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
};