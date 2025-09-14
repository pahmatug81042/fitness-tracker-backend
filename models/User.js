const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define User schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please add a username"],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            minlength: 6,
        },
    },
    { timestamps: true },
);

// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);