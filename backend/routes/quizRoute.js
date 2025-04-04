import express from "express";
const router = express.Router();
import {
    createQuiz,
    setStartQuizEndQuiz,
    joinQuiz,
    handleQuestion,
    viewQuizDetails,
    deleteQuiz,
    viewAllCreatedQuizes,
    updatequizExitTime
} from "../controllers/quizController.js";
import { protect} from "../middleware/authMiddleware.js";

router.post('/create', protect, createQuiz);
router.get('/getCreatedQuizes',protect,viewAllCreatedQuizes);
router.get('/viewQuiz/:id',protect,viewQuizDetails);
router.delete('/delete/:id',protect,deleteQuiz);
router.post("/se/:id", protect, setStartQuizEndQuiz);
router.post("/join", protect, joinQuiz);
router.post("/handle-question/:id", protect, handleQuestion);
router.post("/updateExitTime/:id",protect,updatequizExitTime);


export default router;
