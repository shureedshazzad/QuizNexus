import asyncHandler from "../middleware/asyncHandler.js";
import Progress from "../models/progressModel.js";
import { generateLlamaResponse } from "../utils/groqClient.js";
import mongoose from "mongoose";


// @desc    Generate AI-based adaptive question
// @route   POST /api/generate-question
// @access  Private
// @desc    Generate AI-based adaptive question
// @route   POST /api/generate-question
// @access  Private
const generateAdaptiveQuestion = asyncHandler(async (req, res) => {
  const { userId, subjectId } = req.body;

  if (!userId || !subjectId) {
    res.status(400);
    throw new Error('User ID and Subject ID are required');
  }

  try {
    // Fetch user's progress
    const progress = await Progress.findOne({ user: userId, subject: subjectId })
      .populate('user', 'userName avatar')
      .populate('subject', 'subjectName');

    if (!progress) {
      res.status(404);
      throw new Error('Progress not found');
    }

    const subjectName = progress.subject.subjectName;
    const questions = progress.questions;
    const previousQuestions = questions.map(q => q.questionText.toLowerCase().trim());
    const lastQuestionIncorrect =
      questions.length > 0 && questions[questions.length - 1].isCorrect === false;
    const lastQuestionText =
      lastQuestionIncorrect ? questions[questions.length - 1].questionText : null;

    // Function to generate a question with uniqueness check
    const generateUniqueQuestion = async (attempt = 1) => {
      if (attempt > 3) { // Limit retry attempts
        throw new Error('Failed to generate unique question after 3 attempts');
      }

      // Build the base prompt
      let prompt = `
You are an educational AI.

Create a question for the subject "${subjectName}".

User's learning stats:
- Correct Answers: ${progress.correctAnswers}
- Total Attempts: ${progress.totalAttempts}
- Current Streak: ${progress.currentStreak}
- Max Streak: ${progress.maxStreak}
- Success rate: ${progress.success_rate?.toFixed(2) || 0}%

Question requirements:
- Must be unique (not asked before)
- Difficulty should be adjusted based on success rate:
  * High success (>70%): harder question
  * Low success (<40%): easier question
  * Medium: medium difficulty
`;

      // If last question was incorrect, include a hint
      if (lastQuestionIncorrect && lastQuestionText) {
        prompt += `
The user got the previous question wrong. Re-ask a similar topic to reinforce understanding but with slightly easier difficulty.
Previous question was: "${lastQuestionText}"
Generate a variation that tests the same concept but is different enough.
`;
      }

      // Include examples of previous questions to avoid
      if (previousQuestions.length > 0) {
        prompt += `
Examples of previous questions (DO NOT REPEAT THESE):
${previousQuestions.slice(0, 5).map((q, i) => `${i+1}. ${q}`).join('\n')}
`;
      }

      // Final instruction
      prompt += `
Format your response with just the question text (no numbering or "Question:" prefix).
The question must be completely new and not resemble any previous questions.
`;

      // Generate the question from AI with error handling
      let aiResponse;
      try {
        aiResponse = await generateLlamaResponse(prompt);
        if (!aiResponse) {
          throw new Error('AI response was empty');
        }
      } catch (aiError) {
        console.error('AI generation failed:', aiError);
        // Fallback question if AI fails
        aiResponse = `What is the main concept in ${subjectName} you're currently studying?`;
      }

      // Clean the question text
      const questionText = aiResponse.trim();

      // Check for duplicates (case insensitive and ignoring punctuation)
      const isDuplicate = previousQuestions.some(prevQ => {
        const normalize = (str) => str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
        return normalize(prevQ) === normalize(questionText);
      });

      if (isDuplicate) {
        console.log(`Duplicate question detected: "${questionText}" - regenerating...`);
        return generateUniqueQuestion(attempt + 1);
      }

      return questionText;
    };

    // Generate a unique question
    const questionText = await generateUniqueQuestion();

    // Create a new question object
    const newQuestion = {
      questionId: new mongoose.Types.ObjectId(),
      questionText,
      isCorrect: false,
    };

    // Add the new question to progress
    progress.questions.push(newQuestion);
    progress.totalAttempts += 1;
    progress.lastAttemptedAt = new Date();
    await progress.save();

    res.status(200).json({
      success: true,
      questionId: newQuestion.questionId,
      questionText: newQuestion.questionText,
    });

  } catch (error) {
    console.error('Error generating adaptive question:', error);
    
    // Return a meaningful error response
    res.status(500).json({
      success: false,
      message: 'Failed to generate question',
      error: error.message,
    });
  }
});
// @desc    Update user's progress after answering a question
// @route   POST /api/progress-update
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
    const { userId, subjectId, questionId, questionText, userAnswer } = req.body;
  
    if (!userId || !subjectId || !questionId || !questionText || !userAnswer) {
      res.status(400);
      throw new Error('User ID, Subject ID, questionId, questionText, and userAnswer are required');
    }
  
    // Find the user's progress document
    const progress = await Progress.findOne({ user: userId, subject: subjectId });
  
    if (!progress) {
      res.status(404);
      throw new Error('Progress not found');
    }
  
    // Ask AI if the user's answer is correct
    const aiPrompt = `
    You are an intelligent educational AI assistant.
    Evaluate the following question and the user's answer.
    Question: ${questionText}
    User's Answer: ${userAnswer}
    Respond in this exact JSON format:
    {
    "isCorrect": boolean,
    "explanation": "brief explanation of why the answer is correct or incorrect"
    }
    `;
  
    const aiResponse = await generateLlamaResponse(aiPrompt);
    let evaluation;
    try {
        // Remove markdown code block formatting if present
         const cleanedResponse = aiResponse.replace(/```(?:json)?/g, '').trim();
         evaluation = JSON.parse(cleanedResponse);
      if (typeof evaluation.isCorrect !== 'boolean' || !evaluation.explanation) {
        throw new Error('Invalid AI response format');
      }
    } catch (err) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Could not evaluate answer');
    }
   

    // Mark the specific question as correct in the questions array
    const questionToUpdate = progress.questions.find(q => q.questionId.toString() === questionId);
  
    if (evaluation.isCorrect) {
      progress.correctAnswers += 1;
      progress.currentStreak += 1;
  
      if (progress.currentStreak > progress.maxStreak) {
        progress.maxStreak = progress.currentStreak;
      }
 
      if (questionToUpdate) {
        questionToUpdate.isCorrect = true;
      }
    } else {
      progress.currentStreak = 0; // Reset streak on incorrect
    }

    questionToUpdate.explanation = evaluation.explanation;
  
    // Update success rate
    progress.success_rate = (progress.correctAnswers / progress.totalAttempts) * 100;
  
    // Save the updated progress
    await progress.save();
  
    res.json({
      message: 'Progress updated successfully',
      explanation:questionToUpdate.explanation,
    });
  });


// @desc    Provide the feedback
// @route   POST /api/feedback
// @access  Private
const provideFeedback = asyncHandler(async (req, res) => {
    const { userId, subjectId } = req.body;

    // Validate input
    if (!userId || !subjectId) {
        res.status(400);
        throw new Error('User ID and Subject ID are required');
    }

    // Fetch user's progress
    const progress = await Progress.findOne({ user: userId, subject: subjectId })
        .populate('user', 'userName avatar')
        .populate('subject', 'subjectName');

    if (!progress) {
        res.status(404);
        throw new Error('Progress not found');
    }

    const successRate = progress.success_rate;
    const userName = progress.user.userName;
    const subjectName = progress.subject.subjectName;

  const aiPrompt = `
  You are an educational coach.
  
  The user "${userName}" has the following statistics in the subject "${subjectName}":

- Correct Answers: ${progress.correctAnswers}
- Total Attempts: ${progress.totalAttempts}
- Current Streak: ${progress.currentStreak}
- Max Streak: ${progress.maxStreak}
- Success Rate: ${successRate.toFixed(2)}%

Based on the success rate and max streak, provide tailored feedback:

- If success rate > 80% and max streak > 5: Praise the user for consistent performance and suggest advancing to more challenging topics.
- If success rate between 50% and 80% or max streak between 3 and 5: Encourage the user to continue practicing and identify areas for improvement.
- If success rate < 50% or max streak < 3: Motivate the user to revisit foundational concepts and provide strategies for improvement.

Format:
Feedback: ...
`;

    // Generate feedback using AI
    const aiResponse = await generateLlamaResponse(aiPrompt);

    res.json({
        user: userName,
        subject: subjectName,
        successRate: successRate,
        avatar: progress.user.avatar,
        feedback: aiResponse.trim(),
    });
});

export {generateAdaptiveQuestion, updateProgress, provideFeedback}
