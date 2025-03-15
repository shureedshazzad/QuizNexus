import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useViewQuizQuery, useDeleteQuizMutation, useSetStartTimeEndTimeOfQuizMutation } from "../slices/quizesApiSlice.js";
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const ViewQuizDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: quizData, isLoading, isError } = useViewQuizQuery(id);
  const [deleteQuiz, { isLoading: deleteLoading }] = useDeleteQuizMutation();
  const [setStartTimeEndTimeOfQuiz, { isLoading: setStartTimeEndTimeLoading }] = useSetStartTimeEndTimeOfQuizMutation();

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

  // Restore modal state on component mount
  useEffect(() => {
    const isModalOpen = localStorage.getItem('isModalOpen');
    if (isModalOpen === 'true') {
      setIsModalOpen(true);
    }
  }, []);

  // Start the quiz
  const handleStartQuiz = async () => {
    try {
      setLoading(true);
      const response = await setStartTimeEndTimeOfQuiz(id).unwrap();

      // Set new quiz times
      const startTime = new Date(response.quiz_start_time);
      const endTime = new Date(response.quiz_end_time);

      // Update state and localStorage
      setQuizTimes({ start: startTime, end: endTime });
      localStorage.setItem('quizStartTime', startTime);
      localStorage.setItem('quizEndTime', endTime);
      localStorage.setItem('isModalOpen', 'true'); // Store modal state
      toast.success('Quiz Initiated');
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  // Close modal and remove state from localStorage
  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.removeItem('isModalOpen'); // Remove modal state
  };



  // Countdown effect
  useEffect(() => {
    if (!quizTimes.start || !quizTimes.end) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const startTime = quizTimes.start.getTime();
      const endTime = quizTimes.end.getTime();

      // Calculate time differences
      const timeUntilStart = Math.max(0, Math.floor((startTime - now) / 1000));
      const timeUntilEnd = Math.max(0, Math.floor((endTime - now) / 1000));

      // Determine quiz status
      let status = 'pending';
      if (now >= startTime && now < endTime) status = 'active';
      if (now >= endTime) status = 'completed';

      // Update countdown state
      setCountdown({
        status,
        time: status === 'pending' ? timeUntilStart : timeUntilEnd
      });

      // Handle status changes
      if (status === 'active' && countdown.status !== 'active') {
        toast.info("Quiz has started!");
      }
      if (status === 'completed') {
        toast.info("Quiz has finished!");
        closeModal(); // Close modal when quiz ends
        localStorage.removeItem('quizStartTime');
        localStorage.removeItem('quizEndTime');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimes, countdown.status]);

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center text-danger">Error loading quiz details</p>;

  // Handle quiz deletion
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteQuiz(id);
      toast.success("Quiz deleted successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error deleting quiz");
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const nextQuestion = () => {
    if (quizData?.quiz.questions && currentQuestionIndex < quizData.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Format time in hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="container-xxl py-5">
    <div className="row g-5 d-flex justify-content-center">
      <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
        <div className="h-100 d-flex align-items-center p-5 bg-light shadow-lg rounded">
          {/* Quiz content */}
          <div className="w-100">
            <h2 className="mb-4 text-center">{quizData.quiz.quiz_name}</h2>
            <p className="text-center text-muted">{quizData.quiz.quiz_description}</p>
            <p className="text-center fw-bold text-primary">Quiz Code: {quizData.quiz.quiz_code}</p>

            {/* Show questions with pagination */}
            <div className="p-3 border rounded mb-3">
              <h5>Question {currentQuestionIndex + 1}</h5>
              <p className="fw-bold">{quizData.quiz.questions[currentQuestionIndex].description}</p>

              {/* Display Image if available */}
              {quizData.quiz.questions[currentQuestionIndex].imageUrl && (
                <img
                  src={quizData.quiz.questions[currentQuestionIndex].imageUrl}
                  alt="Question"
                  className="img-fluid mb-2 rounded"
                  style={{ maxHeight: "150px" }}
                />
              )}

              {/* Options Display */}
              <ul className="list-group mb-3">
                {quizData.quiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <li key={index} className="list-group-item">{option}</li>
                ))}
              </ul>

              {/* Show correct answer */}
              <p className="fw-bold text-success">Correct Answer: {quizData.quiz.questions[currentQuestionIndex].correctAnswer}</p>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" disabled={currentQuestionIndex === 0} onClick={prevQuestion}>
                Previous
              </button>
              <button className="btn btn-secondary" disabled={currentQuestionIndex === quizData.quiz.questions.length - 1} onClick={nextQuestion}>
                Next
              </button>
            </div>
            {/* Start Quiz & Delete Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-success" onClick={handleStartQuiz} disabled={setStartTimeEndTimeLoading}>
                {setStartTimeEndTimeLoading ? "Starting..." : "Start Quiz"}
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete Quiz"}
              </button>
            </div>

            {deleteLoading && <Loader />}
          </div>
        </div>
      </div>
    </div>

    {/* Backdrop */}
    {isModalOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
          zIndex: 1000, // Ensure it's above other content
        }}
        onClick={closeModal} // Close modal when backdrop is clicked
      ></div>
    )}

    {/* Countdown Modal */}
    {isModalOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001, // Ensure it's above the backdrop
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '500px',
          }}
        >
          <div style={{ backgroundColor: '#0d6efd', color: 'white', padding: '10px', borderRadius: '8px 8px 0 0' }}>
            <h5 style={{ margin: 0 }}>
              {countdown.status === 'pending' ? 'Quiz Starting Soon' : 
               countdown.status === 'active' ? 'Quiz in Progress' : 'Quiz Completed'}
            </h5>
            <button
              type="button"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
              onClick={closeModal} // Use closeModal function
            >
              &times;
            </button>
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {countdown.status !== 'completed' ? (
              <>
                <h3 style={{ marginBottom: '20px' }}>
                  {countdown.status === 'pending' ? 'Starts in:' : 'Ends in:'}
                </h3>
                <h1
                  style={{
                    fontSize: '3rem',
                    color: countdown.status === 'pending' ? '#0d6efd' : '#dc3545',
                  }}
                >
                  {formatTime(countdown.time)}
                </h1>
              </>
            ) : (
              <h3 style={{ color: '#28a745' }}>Quiz has ended!</h3>
            )}
          </div>
          <div style={{ textAlign: 'right', padding: '10px' }}>
            <button
              type="button"
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={closeModal} // Use closeModal function
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ViewQuizDetailsScreen;