import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoute from './routes/userRoute.js';
import quizRoute from './routes/quizRoute.js';
import subjectRoute from './routes/subjectRoute.js';
import groqRoute from './routes/groqRoute.js';
import { createServer } from 'http'; // HTTP server for Socket.IO

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
 app.use('/api/subjects',subjectRoute);//subjectRoute
 app.use('/api/groqs', groqRoute);//groqRoute


 const __dirname = path.resolve();


// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static(path.join(__dirname,'/frontend/build')));

  //any route that is not api will be redirected to index.html

  app.get('*',(req,res) =>
    res.sendFile(path.resolve(__dirname, 'frontend','build','index.html'))
  );
}

else{
  app.get('/', (req, res) => {
  res.send('API is running...');
});

}




//error handling
app.use(notFound);
app.use(errorHandler);
  



//create an http server
const httpServer = createServer(app);



httpServer.listen(port, () => console.log(`Server is running on port ${port}`));
  




