import express from "express";
const router = express.Router();
import {
    createQuiz,
    setStartQuizEndQuiz,
    joinQuiz,
    handleQuestion,
    endQuiz,
    showLeaderBoards,
    viewQuizDetails,
    deleteQuiz,
    viewAllCreatedQuizes
} from "../controllers/quizController.js";
import { protect} from "../middleware/authMiddleware.js";

router.post('/create', protect, createQuiz);
router.get('/getCreatedQuizes',protect,viewAllCreatedQuizes);
router.get('/viewQuiz/:id',protect,viewQuizDetails);
router.delete('/delete/:id',protect,deleteQuiz);
router.post("/se/:id", protect, setStartQuizEndQuiz);
router.post("/join", protect, joinQuiz);
router.post("/:id/handle-question", protect, handleQuestion);
router.post("/:id/end", protect, endQuiz);
router.get("/:id/leaderboard", protect, showLeaderBoards);

export default router;
