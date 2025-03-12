import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    avatar: {
        type: String,
        required: true,
    },
    total_score: { 
        type: Number,
        required: true,
        default: 0,
    },
    level: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpGeneratedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Method to determine the level based on total_score
userSchema.methods.calculateLevel = function () {
    const score = this.total_score;
    if (score >= 500) return "Knowledge Emperor";
    if (score >= 400) return "Quiz Maestro";
    if (score >= 300) return "Knowledge Kingpin";
    if (score >= 200) return "Quiz Conqueror";
    if (score >= 100) return "Rising Quizzer";
    return "Brainy Beginner";
};

// Middleware to update the level whenever total_score changes
userSchema.pre('save', function (next) {
    if (this.isModified('total_score')) {
        this.level = this.calculateLevel();
    }
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
export default User;