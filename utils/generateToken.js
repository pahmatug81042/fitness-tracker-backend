const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Generates a JWT token for a given userId
 * @params {string} userId - MongoDB ObjectID of the user
 * @returns { string } - Signed JWT
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId }, // payload
        process.env.JWT_SECRET, // secret from .env
        { expiresIn: "30d" } // expiration
    );
};

module.exports = generateToken;