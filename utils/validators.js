// Validate email format
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validate password strength (min 6 chars)
const isValidPassword = (password) => {
    return typeof password === "string" && password.trim().length >= 6;
};

// Validate workout input
const isValidWorkout = ({ exerciseId, exerciseName, sets, reps }) => {
    if (!exerciseId || !exerciseName) return false;
    if (sets && (isNaN(sets) || sets <= 0)) return false;
    if (reps && (isNaN(reps) || reps <= 0)) return false;
    return true;
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidWorkout,
};