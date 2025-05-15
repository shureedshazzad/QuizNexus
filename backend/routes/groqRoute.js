import express from "express";
const router = express.Router();

import { generateAdaptiveQuestion, updateProgress , provideFeedback } from "../controllers/aiBasedAdaptiveLearningController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post('/generate-question', protect, generateAdaptiveQuestion);
router.post('/progress-update', protect, updateProgress);
router.post('/feedback',protect,provideFeedback);

export default router;
