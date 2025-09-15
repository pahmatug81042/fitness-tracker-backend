const express = require("express");
const {
    fetchExercises,
    addExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
} = require ("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route to fetch exercises from RapidAPI
router.get("/all", fetchExercises);

// Protected routes for user's exercises
router.use(protect); // all routes below require auth
router.route("/").get(getExercises).post(addExercise);
router
    .route("/:id")
    .get(getExerciseById)
    .put(updateExercise)
    .delete(deleteExercise);

module.exports = router;