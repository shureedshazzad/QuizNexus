# 🎉 QuizNexus - Adaptive Quiz Platform

![QuizNexus Banner](https://via.placeholder.com/1200x300?text=QuizNexus+Banner)

---

## 🚀 Overview

**QuizNexus** is a dynamic, real-time quiz platform that offers adaptive learning through AI-generated quizzes and personalized user progress tracking. It empowers users to create, join, and compete in quizzes while providing a smooth, engaging experience with real-time updates, countdowns, and leaderboards.

---

## ✨ Features

### User Features
- 👤 **User Registration & OTP Verification**  
  Secure email OTP-based signup & login with expiration timers.

- 📝 **Adaptive Learning**  
  AI-driven question generation tailored to user progress and subjects.

- 🎯 **Join & Participate in Quizzes**  
  Real-time quizzes with countdown timers, question pagination, and answer tracking.

- 🏆 **Leaderboards & Rankings**  
  Live leaderboard updates and user-specific positions with disqualification handling.

- 📊 **Progress Tracking**  
  Track user progress per subject and adapt quiz difficulty dynamically.

---

### Admin & Creator Features
- 🎨 **Create & Manage Quizzes**  
  Add quizzes with questions, images, options, and correct answers.

- ⏰ **Start & Schedule Quizzes**  
  Set quiz start and end times with countdown modal and real-time status.

- 🗑️ **Delete Quizzes**  
  Safely delete quizzes with confirmation dialogs.

- 👀 **View Joined Quizzes & User Details**  
  Inspect user participation history and detailed quiz results.

---

### Backend API Features
- 🔐 **Authentication**  
  Secure JWT-based authentication with OTP verification.

- 📚 **Subjects & Progress Management**  
  CRUD operations for subjects and progress updates per user.

- 🎲 **Quiz APIs**  
  Create, retrieve, update, delete quizzes; start quizzes and track leaderboard.

- 🤖 **AI Integration**  
  Adaptive quiz question generation using LLaMA model via Groq API.

- ⏳ **Real-time Updates**  
  Quiz status polling and leaderboard updates every few seconds.

---

## 🛠️ Technology Stack

| Frontend                                   | Backend                             | AI & APIs                | Database                  |
|--------------------------------------------|------------------------------------|--------------------------|---------------------------|
| React.js with Hooks & React Router 🧩       | Node.js + Express.js 🖥️             | LLaMA 4 Scout via Groq API 🤖 | MongoDB with Mongoose 🗃️     |
| Redux Toolkit (RTK Query) ⚛️                | JWT Authentication 🔐               | OpenAI API for fallback  | Redis (optional caching)   |
| Bootstrap 5 for responsive UI 🎨            | RESTful API Endpoints 🌐            | AI-powered adaptive quiz |                           |
| React Icons & React Toastify for UX 🎉     | Nodemailer for OTP emails 📧         |                          |                           |

---

## 📦 Installation & Setup

### Backend

1. Clone the repo and navigate to backend folder  
   ```bash
   git clone https://github.com/yourusername/QuizNexus.git
   cd QuizNexus/backend
