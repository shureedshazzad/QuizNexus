import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String, // URL for the image (optional)
        default: null,
    },
    options: {
        type: [String], // Array of 4 possible answers
        required: true,
        validate: {
            validator: function (options) {
                return options.length === 4; // Ensure exactly 4 options
            },
            message: "There must be exactly 4 options for each question.",
        },
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
});

const quizSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quiz_name: {
        type: String,
        required: true,
    },
    quiz_description: {
        type: String,
        required: true,
    },
    quiz_code:{
        type:String,
        required:true,
        unique: true,
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    questions: [questionSchema], // Array of questions
    quiz_duration: {
        type: Number, 
        required: true,
    },
    quiz_start_time: {
        type: Date, // Timestamp for when the quiz starts
        default: null, // Initially null, set when the quiz starts
    },
    quiz_end_time: {
        type: Date, // Timestamp for when the quiz ends
        default: null, // Initially null, set when the quiz ends
    },
    status: {
        type: String,
        enum: ["pending", "active", "completed"],
        default: "pending",
    },
    leaderboard: [
        {
          user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          score: {
            type: Number,
            default: 0,
          },
          currentQuestionIndex: {
            type: Number,
            default: 0,
          }
        },
    ],
    winners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    questionOrder: {
        type: [Number], // Array of question indices
        default: function () {
          return this.questions.map((_, index) => index); // Default order is the order of questions in the array
        },
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

quizSchema.methods.shuffleQuestions = function () {
    this.questionOrder = this.questions
      .map((_, index) => index)
      .sort(() => Math.random() - 0.5);
    return this;
  };

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;