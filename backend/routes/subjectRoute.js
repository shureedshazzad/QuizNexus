import express from "express";
const router = express.Router();

import {
    createSubject,
    getSubjects,
    deleteSubject,
    viewProgress
} from "../controllers/subjectController.js";
import { protect, admin} from "../middleware/authMiddleware.js";

router.post('/create', protect, admin, createSubject);
router.get('/', protect, getSubjects);
router.delete('/delete/:id',protect,admin,deleteSubject);
router.get('/progress',protect,viewProgress)

export default router;

