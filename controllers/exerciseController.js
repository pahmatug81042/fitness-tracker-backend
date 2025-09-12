const { exerciseClient, youtubeClient } = require("../utils/apiClient");

// Fetch exercises from ExerciseDB
const searchExercises = async (req, res) => {
    try {
        const { query } = req.query;
        const response = await exerciseClient.get(`exercises/name/${query}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch related YouTube videos
const getExerciseVideos = async (req, res) => {
    try {
        const { name } = req.query;
        const response = await youtubeClient.get("/", { params: { q: name + " exercise" } });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { searchExercises, getExerciseVideos };