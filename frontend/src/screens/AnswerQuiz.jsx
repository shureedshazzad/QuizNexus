import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useViewQuizQuery, useHandleQuizMutation, useUpdateExitTimeMutation } from "../slices/quizesApiSlice";
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { FaClock,FaCheck,FaTimes } from "react-icons/fa";
import { set } from "mongoose";

const AnswerQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // API Hooks
  const [handleQuiz] = useHandleQuizMutation();
  const { data: quizData, isLoading, isError } = useViewQuizQuery(id,{pollingInterval: 5000});;
  const [updateExitTime] = useUpdateExitTimeMutation();

  // Component State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);


  const [quizCompleted, setQuizCompleted] = useState(() => {
    return JSON.parse(localStorage.getItem("quizCompleted")) || false;
  });

   // State for tracking quiz timing
  const [quizTimes, setQuizTimes] = useState(() => {
      const storedStart = localStorage.getItem('quizStartTime');
      const storedEnd = localStorage.getItem('quizEndTime');
      return {
        start: storedStart ? new Date(storedStart) : null,
        end: storedEnd ? new Date(storedEnd) : null
      };
  });

    // Countdown state
  const [countdown, setCountdown] = useState({
    status: 'pending', // pending, active, completed
    time: 0
  });


  // Fetch participant data from leaderboard
  useEffect(() => {
    if (quizData?.quiz && userInfo) {
      const foundParticipant = quizData.quiz.leaderboard.find(entry => entry.user_id._id === userInfo._id);
      if (!foundParticipant) {
        toast.error("You are not a participant in this quiz!");
        navigate('/');
        return;
      }
      setParticipant(foundParticipant);
      setCurrentQuestionIndex(foundParticipant.currentQuestionIndex || 0);
    }
  }, [quizData, userInfo, navigate]);

  // Get current question using participant's questionOrder
  const currentQuestion = participant && quizData?.quiz?.questions?.[participant.questionOrder[currentQuestionIndex]];

  // Update quiz times
  useEffect(() => {
    if (quizData?.quiz) {
      const startTime = quizData.quiz.quiz_start_time ? new Date(quizData.quiz.quiz_start_time) : null;
      const endTime = quizData.quiz.quiz_end_time ? new Date(quizData.quiz.quiz_end_time) : null;
      setQuizTimes({ start: startTime, end: endTime });
      localStorage.setItem('quizStartTime', startTime);
      localStorage.setItem('quizEndTime', endTime);
    }
  }, [quizData]);

  // Countdown effect
  useEffect(() => {
    if (!quizTimes.start || !quizTimes.end) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const startTime = quizTimes.start.getTime();
      const endTime = quizTimes.end.getTime();
      const timeUntilStart = Math.max(0, Math.floor((startTime - now) / 1000));
      const timeUntilEnd = Math.max(0, Math.floor((endTime - now) / 1000));
      let status = 'pending';
      if (now >= startTime && now < endTime) status = 'active';
      if (now >= endTime) status = 'completed';
      setCountdown({ status, time: status === 'pending' ? timeUntilStart : timeUntilEnd });
      
      // Handle status changes
      if (status === 'active' && countdown.status !== 'active') {
        toast.info("Quiz has started!");
      }
      if (status === 'completed') {
        toast.info("Quiz has finished!");
        localStorage.removeItem('quizStartTime');
        localStorage.removeItem('quizEndTime');
        localStorage.removeItem('quizCompleted');
        clearInterval(interval);
        navigate(`/show-leaderboard/${id}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimes, countdown.status]);

  // Handle answer submission
  const handleAnswer = async (option) => {
    if (isAnswered || loading) return;
    try {
      setLoading(true);
      setSelectedOption(option);
      const response = await handleQuiz({ id, data: { userId: userInfo._id, answer: option } }).unwrap();


      // Correct answer logic
      const correctAnswer = response.correctAnswer; // Assuming the backend returns the correct answer
      setCorrectOption(correctAnswer);
      setIsAnswered(true);
      if (response.currentQuestionIndex === response.l) {
        try {
          await updateExitTime({
            id: id,
            data: { userId: userInfo._id }
          }).unwrap();   
          setTimeout(() => {
            toast.success("You have completed the Quiz");
            setCurrentQuestionIndex(response.currentQuestionIndex)
            setIsAnswered(false);
            setSelectedOption(null);
            setCorrectOption(null);
            setQuizCompleted(true);
            localStorage.setItem("quizCompleted", JSON.stringify(true));
         
          },2000)

        } catch (error) {
          toast.error("Failed to record quiz completion");
          console.error(error);
        }
        return;
      }
      setTimeout(() => {
        setCurrentQuestionIndex(response.currentQuestionIndex);
        setIsAnswered(false);
        setSelectedOption(null);
        setCorrectOption(null);
      }, 2000);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => handleAnswer(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center text-danger">Error loading quiz</p>;

  return (
    <div className="container-xxl py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      {quizData.quiz.quiz_start_time === null && quizData.quiz.quiz_end_time === null ? (
        <div className="row justify-content-center">
          <h3>Quiz is not announced Yet</h3>
        </div>
      ) : countdown.status === 'pending' ? (
        <div className="text-center">
          <FaClock size={50} className="mb-3 text-warning" />
          <h3>The quiz will start in {formatTime(countdown.time)}</h3>
        </div>
      ) : quizCompleted && countdown.status === 'active' ? (
        <div className="text-center">
          <h3>You have completed the quiz.</h3>
          <p>Please wait until the quiz ends.</p>
          <FaClock size={50} className="mb-3 text-warning" />
          <h3>The quiz will end in {formatTime(countdown.time)}</h3>
        </div>
      ) : (
        <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
          <div className="h-100 d-flex align-items-center p-5 bg-light shadow-lg rounded">
            <div className="w-100">
              <h2>{quizData.quiz.quiz_name}</h2>
              {countdown.status !== 'pending' && (
                <div className="badge bg-primary fs-5">{formatTime(countdown.time)}</div>
              )}
              {currentQuestion && (
                <div className="p-3 border rounded mb-3">
                  <h5>Question {currentQuestionIndex + 1} of {participant.questionOrder.length}</h5>
                  {/* Displaying Score */}
                  
                  <h6>Score: {currentQuestion.score}</h6>

                  <p className="fw-bold">{currentQuestion.description}</p>

                  
                {/* Display Image if available */}
                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question"
                    className="img-fluid mb-2 rounded"
                    style={{ maxHeight: "150px" }}
                  />
                )}

                  <ul className="list-group mb-3">
                    {currentQuestion.options.map((option, idx) => {
                      let optionClass = "list-group-item";
                      let icon = null;
                      if (isAnswered) {
                        if (option === selectedOption) {
                          // If the selected option is correct
                          if (option === correctOption) {
                            optionClass += " bg-success text-white"; // Green background for correct answer
                            icon = <FaCheck className="ms-2" />; // Checkmark icon
                          } else {
                            optionClass += " bg-danger text-white"; // Red background for incorrect answer
                            icon = <FaTimes className="ms-2" />; // Cross icon
                          }
                        }
                        // Ensure the correct option is always displayed with green background and checkmark
                        if (option === correctOption && option !== selectedOption) {
                          optionClass += " bg-success text-white"; // Green background for correct answer
                          icon = <FaCheck className="ms-2" />; // Checkmark icon
                        }
                      }

                      return (
                        <li key={idx} className={optionClass} onClick={() => !isAnswered && handleAnswer(option)}
                            style={{ cursor: isAnswered ? "default" : "pointer" }}>
                          {option} {icon}
                        </li>
                      );
                    })}
                  </ul>
                  {countdown.status === 'active' && !isAnswered && (
                    <button className="btn btn-outline-secondary w-100 mt-2" onClick={handleSkip} disabled={loading}>Skip Question</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerQuiz;
