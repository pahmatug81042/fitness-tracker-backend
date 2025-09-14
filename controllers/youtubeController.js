const axios = require("axios");
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.RAPIDAPI_KEY;
const YOUTUBE_API_HOST = process.env.YOUTUBE_HOST || "youtube-search-and-download.p.rapidapi.com";

// Search YouTube for videos by exercise name
exports.searchVideos = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const response = await axios.get(
            `https://${YOUTUBE_API_HOST}/search`,
            {
                params: { query: q },
                headers: {
                    "X-RapidAPI-Key": YOUTUBE_API_KEY,
                    "X-RapidAPI-Host": YOUTUBE_API_HOST,
                },
            }
        );

        // Extract top 5 videos
        const videos = response.data?.contents
            ?.filter(item => item.type === "video")
            .slice(0, 5)
            .map(item => ({
                videoId: item.video.videoId,
                title: item.video.title,
                url: `https://www.youtube.com/watch?v=${item.video.videoId}`
            }));

        res.json({ items: videos });
    } catch (error) {
        console.error("YouTube API error:", error.message);
        res.status(500).json({ error: "Failed to fetch videos from YouTube API" });
    }
};