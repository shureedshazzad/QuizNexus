import Quiz from "../models/quizModel.js";
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
//@access Private
const viewAllCreatedQuizes = asyncHandler(async (req, res) => {
  const quizes = await Quiz.find().populate('user_id');
  res.status(200).json(quizes);
})


// @desc    View all joined quizzes of a particular participant
// @route   GET /api/quizzes/joinedQuizes/:id
// @access  Private
const viewJoinedQuizes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Find all quizzes where the user is a participant
     // Correct query to find quizzes where the user is a participant
     const joinedQuizzes = await Quiz.find({
      'leaderboard.user_id': id
    })

    res.status(200).json({
      count: joinedQuizzes.length,
      joinedQuizzes
    });

  } catch (error) {
    console.error('Error fetching joined quizzes:', error);
    res.status(500).json({
      message: 'Server error while fetching joined quizzes',
      error: error.message
    });
  }
});


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


     // Initialize questionStatus array with all questions marked as unanswered
     const questionStatus = quiz.questions.map((_, index) => ({
      questionIndex: index,
      isAnswered: false,
      isCorrect: false
    }));


    // Add the participant to the leaderboard with initial score and currentQuestionIndex
    quiz.leaderboard.push({
      user_id: user_id,
      score: 0, // Initial score
      currentQuestionIndex: 0,
      questionStatus: questionStatus,
      quizEntryTime: new Date()
    });

    // Save the updated quiz
    await quiz.save();

      // Retrieve the participant's leaderboard entry
      const participantEntry = quiz.leaderboard.find(entry => entry.user_id.toString() === user_id.toString());
      if (!participantEntry) {
        return res.status(500).json({ message: "Error retrieving quiz data" });
      }

    res.status(200).json({
      message: "Joined quiz successfully",
      quizId: quiz._id,
      questionOrder: participantEntry.questionOrder, // Retrieve question order for this user
    });
  }
  else{
    return res.status(400).json({ message: "You are disqualified from the quiz. You should be ashamed of yourself" });
  }

});


// @desc    Handle fetching the current question or submitting an answer
// @route   POST /api/quizes/:id/handle-question
// @access  Private
const handleQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, answer } = req.body; // `answer` is optional, it may be null

  const quiz = await Quiz.findById(id);

  if (!quiz || !userId) {
    return res.status(404).json({ message: "Quiz or userId not found" });
  }

  // Check if the quiz has started
  if (quiz.quiz_start_time === null || quiz.quiz_end_time === null) {
    return res.status(400).json({ message: "Quiz has not started yet" });
  }

  // Check if the quiz has ended
  if (new Date() >= new Date(quiz.quiz_end_time)) {
    return res.status(400).json({ message: "Quiz has already ended" });
  }

  // Find the participant in the leaderboard
  const participant = quiz.leaderboard.find(entry => entry.user_id.equals(userId));

  if (!participant) {
    return res.status(404).json({ message: "Participant not found in the quiz" });
  }

  // Get the participant's question order
  const { questionOrder, currentQuestionIndex } = participant;


  // Check if the participant has completed all questions
  if (currentQuestionIndex >= questionOrder.length) {
    return res.status(200).json({
      message: "You have completed the quiz",
    });
  }  
  // Get the current question using the questionOrder array
  const questionIndex = questionOrder[currentQuestionIndex]
  const currentQuestion = quiz.questions[questionOrder[currentQuestionIndex]];

  if (!currentQuestion) {
    return res.status(500).json({ message: "Error retrieving question" });
  }

  // Process answer if provided
  if (answer !== null && answer !== undefined) {
    // Find or create question status entry
    let questionStatus = participant.questionStatus.find(
      qs => qs.questionIndex === questionIndex
    );
    
    if (!questionStatus) {
      questionStatus = {
        questionIndex,
        isAnswered: true,
        isCorrect: answer === currentQuestion.correctAnswer
      };
      participant.questionStatus.push(questionStatus);
    } else {
      questionStatus.isAnswered = true;
      questionStatus.isCorrect = answer === currentQuestion.correctAnswer;
    }

    // Update score if correct
    if (questionStatus.isCorrect) {
      participant.score += currentQuestion.score;
    }
  }
  const corr = currentQuestion.correctAnswer;

  // Move to the next question
  participant.currentQuestionIndex += 1;

  // Save the updated quiz
  await quiz.save();

  res.status(200).json({
    message: "Answer submitted successfully",
    correctAnswer: corr,
    currentQuestionIndex: participant.currentQuestionIndex,
    l: questionOrder.length,
  });
});


// @desc    Update quiz exit time for a particular participant
// @route   POST/api/quizes/update-time/:id
// @access  Private
const updatequizExitTime = asyncHandler(async (req, res) => {
  const { id } = req.params; // Quiz ID
  const { userId } = req.body; // Should receive user ID 
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  // Find the participant in the leaderboard
  const participantIndex = quiz.leaderboard.findIndex(
    entry => entry.user_id.toString() === userId.toString()
  );

  
  if (participantIndex === -1) {
    return res.status(404).json({ message: "Participant not found in this quiz" });
  }
  // Update the exit time
  quiz.leaderboard[participantIndex].quizExitTime = new Date();
  await quiz.save();

  res.status(200).json({ 
    success: true,
    message: "Quiz exit time updated successfully",
    quizExitTime: quiz.leaderboard[participantIndex].quizExitTime
  });
})

//@desc disqualify a particpant
//@route POST/api/quizes/disqualify/:id
//@access Private
const disqualifyPaticipant = asyncHandler(async (req,res) => {
  const { id } = req.params; // Quiz ID
  const { userId } = req.body; // Should receive user ID
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

   // Find the participant in the leaderboard
   const participantIndex = quiz.leaderboard.findIndex(
    entry => entry.user_id.toString() === userId.toString()
  );
  if (participantIndex === -1) {
    return res.status(404).json({ message: "Participant not found in this quiz" });
  }
  // Disqualify the participant
  quiz.leaderboard[participantIndex].isDisqualified = true;
  await quiz.save();
  res.status(200).json({
    success: true,
    message: "Participant disqualified successfully",
  });

})




export {
  createQuiz,
  setStartQuizEndQuiz,
  joinQuiz,
  handleQuestion,
  viewQuizDetails,
  deleteQuiz,
  viewAllCreatedQuizes,
  updatequizExitTime,
  disqualifyPaticipant,
  viewJoinedQuizes 
};








