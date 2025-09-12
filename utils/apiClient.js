const axios = require("axios");
require("dotenv").config();

// ExerciseDB API client
const exerciseClient = axios.create({
    baseURL: "https://exercisedb.p.rapidapi.com",
    headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.EXERCISEDB_HOST,
    },
});

// YouTube Search API client
const youtubeClient = axios.create({
    baseURL: "https://youtube-search-and-download.p.rapidapi.com",
    headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.YOUTUBE_HOST,
    },
});

module.exports = { exerciseClient, youtubeClient };