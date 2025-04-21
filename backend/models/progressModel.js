import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  totalAttempts: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  maxStreak: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  lastAttemptedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;