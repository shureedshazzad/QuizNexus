import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoute from './routes/userRoute.js';
import quizRoute from './routes/quizRoute.js'
import { createServer } from 'http'; // HTTP server for Socket.IO
import { Server } from 'socket.io'; // Socket.IO server



const port = process.env.PORT || 5000;

connectDB();

const app = express();




app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // ✅ Allow cookies & authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // ✅ Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Allow JWT in headers
}));

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
 app.use(cookieParser());

 app.use('/api/users',userRoute);//userRoute
 app.use('/api/quizes',quizRoute);//quizRoute


app.get('/', (req,res) =>{

    res.send('Api is running');
})


app.use(notFound);
app.use(errorHandler);
  
app.listen(port, () => console.log(`Sever is running on port ${port}`));





// //create an http server
// const httpServer = createServer(app);

// //create a socket.io server
// const io = new Server(httpServer, {
//     cors: {
//         origin: 'http://localhost:3000',
//         credentials: true,
//     },
// });


// // Socket.IO connection handler
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);
  
//     // Handle joining a quiz
//     socket.on('join-quiz', (quizId) => {
//       socket.join(quizId); // Join a room for the quiz
//       console.log(`User ${socket.id} joined quiz ${quizId}`);
  
//       // Notify other users in the quiz that a new participant has joined
//       socket.to(quizId).emit('participant-joined', { userId: socket.id });
//     });
  
//     // Handle starting a quiz
//     socket.on('start-quiz', (quizId) => {
//       console.log(`Quiz ${quizId} started by user ${socket.id}`);
  
//       // Notify all participants in the quiz that it has started
//       io.to(quizId).emit('quiz-started', { quizId });
//     });
  
//     // Handle answering a question
//     socket.on('submit-answer', ({ quizId, userId, answer }) => {
//       console.log(`User ${userId} submitted answer for quiz ${quizId}: ${answer}`);
  
//       // Notify all participants in the quiz about the answer submission
//       io.to(quizId).emit('answer-submitted', { userId, answer });
//     });
  
//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('A user disconnected:', socket.id);
//     });
// });



