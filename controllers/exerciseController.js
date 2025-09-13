const fetch = require("node-fetch");
require("dotenv").config();

// ExerciseDB search
exports.searchExercises = async (req, res) => {
    const query = req.query.query || "";
    try {
        const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises?name=${query}`, {
            Headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// YouTube search
exports.searchVideos = async (req, res) => {
    const name = req.query.name || "";
    try {
        const response = await fetch(`https://youtube-search-and-download.p.rapidapi.com/search?query=${name}`, {
            Headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};