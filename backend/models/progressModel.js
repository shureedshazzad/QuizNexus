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
  success_rate: {
    type: Number,
    default: 0,
  },
  lastAttemptedAt: {
    type: Date,
    default: null,
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId, // unique identifier for each question
      default: () => new mongoose.Types.ObjectId(), // use a function to generate a new ObjectId
    },
    questionText: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    explanation:{
      type:String,
      default: null
    }
  }]
}, {
  timestamps: true,
});

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;