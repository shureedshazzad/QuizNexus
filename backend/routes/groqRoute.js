import express from 'express';
import { generateLlamaResponse } from '../utils/groqClient.js';

const router = express.Router();

router.post('/generate-question', async (req, res) => {
  const { input } = req.body;

  try {
    const output = await generateLlamaResponse(input);
    res.json({ result: output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;