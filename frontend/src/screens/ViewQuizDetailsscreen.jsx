import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useViewQuizQuery, useDeleteQuizMutation } from "../slices/quizesApiSlice.js";
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const ViewQuizDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { data: quizData, isLoading, isError } = useViewQuizQuery(id);
  const [deleteQuiz, { isLoading: deleteLoading }] = useDeleteQuizMutation();

  // Pagination for questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center text-danger">Error loading quiz details</p>;

  return (
    <div className="container-xxl py-5">
      <div className="row g-5 d-flex justify-content-center">
        <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
          <div className="h-100 d-flex align-items-center p-5 bg-light shadow-lg rounded">
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
                <button className="btn btn-success">Start Quiz</button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete Quiz"}
                </button>
              </div>

              {deleteLoading && <Loader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuizDetailsScreen;
