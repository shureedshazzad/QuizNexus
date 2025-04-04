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
          },
          questionOrder: {  // Added this field for each participant
            type: [Number],
            default: function() {
                // Generate default order when participant joins
                return Array.from({length: this.parent().questions.length}, (_, i) => i)
                    .sort(() => Math.random() - 0.5);
            }
          },
            questionStatus:[{
                questionIndex: Number,  // Index in the original questions array
                isCorrect: Boolean,
                isAnswered: Boolean,
          }],
          quizEntryTime:{
            type: Date, // Timestamp for when the participant joins the quiz
            default: null, // Initially null, set when the participant joins the quiz
          },
          quizExitTime:{
            type: Date, // Timestamp for when the participant exits the quiz
            default: null, // Initially null, set when the participant exits the quiz
          }
        },
    ],

}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});


const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;