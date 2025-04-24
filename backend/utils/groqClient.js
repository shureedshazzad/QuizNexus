// backend/utils/groqClient.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();


const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY; // Store this in .env

export const generateLlamaResponse = async (userMessage) => {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || 'Groq API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content;
};