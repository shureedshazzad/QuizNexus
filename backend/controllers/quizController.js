import Quiz from "../models/quizModel.js";
import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { v4 as uuidv4 } from "uuid";

// @desc    Create a new quiz
// @route   POST/api/quizes
// @access  Private
const createQuiz = asyncHandler(async (req, res) => {

    const {user_id,quiz_name, quiz_description, questions , quiz_duration } = req.body;

     //Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
        res.status(400);
        throw new Error("Questions must be a non-empty array");
    }
    // Generate a unique quiz code
    let quiz_code;
    let exists = true;
    while (exists) {
      quiz_code = uuidv4().substring(0, 6).toUpperCase();
      exists = await Quiz.findOne({ quiz_code });
    }
    // Create the quiz
    try {
      const quiz = await Quiz.create({
        user_id, 
        quiz_name,
        quiz_description,
        questions,
        quiz_duration,
        quiz_code
      });
    
      res.status(201).json({
        message: "Quiz created successfully",
        quiz,
      });
      
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate quiz_code error
        res.status(400);
        throw new Error("Quiz code already exists. Please try again.");
      } else {
        res.status(500);
        throw new Error("Error creating quiz");
      }
    }
  
  });

//@desc view all quizes
//@route GET/api/createdQuizes
//@access Public
const viewAllCreatedQuizes = asyncHandler(async (req, res) => {
  const quizes = await Quiz.find().populate('user_id');
  res.status(200).json(quizes);
})



// @desc    View a quiz and its details
// @route   GET /api/quizes/:id
// @access  Private
const viewQuizDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id).populate('leaderboard.user_id', 'userName avatar');

  if (!quiz) {
      res.status(404);
      throw new Error("Quiz not found");
  }

  res.status(200).json({
      message: "Quiz details fetched successfully",
      quiz,
  });
});



// @desc    Delete a quiz
// @route   DELETE /api/quizes/delete/:id
// @access  Private
const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the quiz by its id
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  // Ensure that only the creator of the quiz can delete it
  if (quiz.user_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You do not have permission to delete this quiz");
  }

  await Quiz.deleteOne({ _id: quiz._id });

  res.status(200).json({
    message: "Quiz deleted successfully",
  });
});







// @desc    Start a quiz
// @route   POST /api/quizes/se/:id
// @access  Private

const setStartQuizEndQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  try {
    const startTime = new Date();
    startTime.setSeconds(startTime.getSeconds() + 60); // Add 1 minute before initialization
    const quiz_duration_in_second = quiz.quiz_duration * 60; // Convert minutes to seconds
    const endTime = new Date(startTime.getTime() + quiz_duration_in_second * 1000); // Add total_duration in milliseconds

    quiz.quiz_start_time = startTime;
    quiz.quiz_end_time = endTime;

     // Shuffle the questions before starting the quiz
    quiz.shuffleQuestions();
    // Save the quiz with the shuffled question order
    const updatedQuiz = await quiz.save();
    console.log(updatedQuiz)

    res.status(200).json({
      message: "Quiz started successfully",
      quiz_start_time: quiz.quiz_start_time,
      quiz_end_time: quiz.quiz_end_time,
    });
  } catch (error) {
    res.status(400).json({ message: "Error starting quiz" });
  }
});

// @desc    Join a quiz using quiz code
// @route   POST /api/quizes/join
// @access  Private

const joinQuiz = asyncHandler(async (req, res) => {
  const { user_id, quizCode } = req.body;

  if (!user_id) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!quizCode) {
    return res.status(400).json({ message: "Quiz code is required" });
  }

  const quiz = await Quiz.findOne({ quiz_code: quizCode });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  // Check if the user is the quiz creator
  if (user_id === quiz.user_id) {
    return res.status(400).json({ message: "You are the quiz creator. So you should not participate" });
  }


  if (quiz.quiz_end_time !== null && new Date() >= new Date(quiz.quiz_end_time)) {
    return res.status(400).json({ message: "Quiz has already ended" });
  }
  // Check if the participant is already in the quiz
  const isParticipant = quiz.participants.some(participant => participant.equals(user_id));

  if (!isParticipant) {
    // Add the participant to the participants array
    quiz.participants.push(user_id);

    // Add the participant to the leaderboard with initial score and currentQuestionIndex
    quiz.leaderboard.push({
      user_id: user_id,
      score: 0, // Initial score
      currentQuestionIndex: 0, // Start from the first question
    });

    // Save the updated quiz
    await quiz.save();
    res.status(200).json({
      message: "Joined quiz successfully",
      quizId: quiz._id,
      quizName: quiz.quiz_name,
      quizDescription: quiz.quiz_description,
      quiz_start_time: quiz.quiz_start_time,
      quiz_end_time: quiz.quiz_end_time,
    });
  }
  else{
    return res.status(400).json({ message: "You are already in this quiz" });
  }

});


// @desc    Handle fetching the current question or submitting an answer
// @route   POST /api/quizes/:id/handle-question
// @access  Private
const handleQuestion = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { userId, answer } = req.body; // `answer` is optional

  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  // Check if the quiz has started
  if (quiz.quiz_start_time === null && quiz.quiz_end_time === null) {
    return res.status(400).json({ message: "Quiz has not started yet" });
  }

  // Check if the quiz has ended
  if (new Date() >= quiz.quiz_end_time) {
    return res.status(400).json({ message: "Quiz has already ended" });
  }

  // Find the participant in the leaderboard
  const participant = quiz.leaderboard.find(entry =>
    entry.user_id.equals(userId)
  );

  if (!participant) {
    return res.status(404).json({ message: "Participant not found in the quiz" });
  }

  // Get the current question index for the participant
  const currentQuestionIndex = participant.currentQuestionIndex;

  // Check if the participant has completed all questions
  if (currentQuestionIndex >= quiz.questions.length) {
    return res.status(200).json({
      message: "You have completed the quiz",
    });
  }

  // Get the current question using the questionOrder array
  const currentQuestion = quiz.questions[quiz.questionOrder[currentQuestionIndex]];

  if (answer !== null && answer !== undefined) {
    currentQuestion.isAnswerd = true;
  }

  // Check if the answer is correct
  if (answer === currentQuestion.correctAnswer) {
    // Update the participant's score
    participant.score += currentQuestion.score;
  }

  // Move to the next question
  participant.currentQuestionIndex += 1;

  // Save the updated quiz
  await quiz.save();

  res.status(200).json({
    message: "Answer submitted successfully",
    currentQuestionIndex: participant.currentQuestionIndex,
  });
});


// @desc    End a quiz and determine winners
// @route   POST /api/quizes/:id/end
// @access  Private

const endQuiz = asyncHandler(async (req,res) => {
  const { quizId } = req.params;
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404).json("Quiz not found");
    return; 
  }

  if(new Date() >= quiz.quiz_end_time)
  {
      // Set the quiz status to "completed"
      quiz.status = "completed";

      quiz.leaderboard.sort((a, b) => b.score - a.score); // Sort by score in descending order
      quiz.winners = quiz.leaderboard
      .slice(0, Math.min(3, quiz.leaderboard.length)) // Take the top 3 or fewer if less than 3
      .map(entry => entry.user_id); // Map to user IDs

      await quiz.save();

      res.status(200).json({
        message: "Quiz ended successfully",
      });
  }

})

// @desc    Show LeaderBoards and winners
// @route   POST /api/quizes/:id/winners
// @access  Private

const showLeaderBoards = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  // Find the quiz and populate the leaderboard and winners
  const quiz = await Quiz.findById(quizId)
    .populate("leaderboard.user_id","avatar userName") // Populate user details including total_score
    .populate("winners", "avatar userName"); // Populate winner details

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  // Check if the quiz has ended
  if (quiz.status !== "completed") {
    res.status(400);
    throw new Error("Quiz not completed yet");
  }


  res.status(200).json({
    message: "Leaderboard and winners fetched successfully",
    leaderboard: quiz.leaderboard,
    winners: quiz.winners,
  });
});


export {
  createQuiz,
  setStartQuizEndQuiz,
  joinQuiz,
  handleQuestion,
  endQuiz,
  showLeaderBoards,
  viewQuizDetails,
  deleteQuiz,
  viewAllCreatedQuizes
};








