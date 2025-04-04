import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useCreateQuizesMutation } from '../slices/quizesApiSlice';

const CreateQuizScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Form state management
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState('');
  const [questions, setQuestions] = useState([
    { description: '', imageUrl: null, options: ['', '', '', ''], correctAnswer: '', score: 1 },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [createQuiz, { isLoading }] = useCreateQuizesMutation();

  // Handle question field changes
  const handleQuestionChange = (field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handle option changes
  const handleOptionChange = (optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

    // Handle score change
    const handleScoreChange = (value) => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].score = Math.max(1, value); // Ensures a minimum score of 1
      setQuestions(updatedQuestions);
    };
  
  

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].imageUrl = reader.result;
        setQuestions(updatedQuestions);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([...questions, { description: '', imageUrl: null, options: ['', '', '', ''], correctAnswer: '', score: 1 }]);
    setCurrentQuestionIndex(questions.length);
  };

  // Remove the current question
  const removeQuestion = () => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== currentQuestionIndex));
      setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    for (const question of questions) {
      if (!question.description || question.options.some((opt) => !opt) || !question.correctAnswer || question.score <= 0) {
        toast.error('Please fill out all fields for each question.');
        return;
      }
    }
    try {
      setLoading(true);
      const response = await createQuiz({
        user_id: userInfo._id,
        quiz_name: quizName,
        quiz_description: quizDescription,
        questions,
        quiz_duration: quizDuration,
      }).unwrap();
      toast.success('Quiz created successfully!');
      const quizId = response.quiz._id; //fetch the quiz id
      console.log(response);
      localStorage.removeItem('quizStartTime');
      localStorage.removeItem('quizEndTime');
      navigate(`/view-quiz/${quizId}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Error creating quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="row g-5 d-flex justify-content-center">
        <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
          <div className="h-100 d-flex align-items-center p-5 bg-light shadow-lg rounded">
            <form onSubmit={submitHandler} className="w-100">
              <h2 className="mb-4 text-center">Create a New Quiz</h2>

              <input type="text" className="form-control mb-3" placeholder="Quiz Name" value={quizName} onChange={(e) => setQuizName(e.target.value)} required />
              <textarea className="form-control mb-3" placeholder="Quiz Description" value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} required />
              <input type="number" className="form-control mb-3" min="1" placeholder="Duration (minutes)" value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} required />
              
              <div className="p-3 border rounded mb-3">
                <h5>Question {currentQuestionIndex + 1}</h5>
                <textarea className="form-control mb-2" placeholder="Question Description" value={questions[currentQuestionIndex].description} onChange={(e) => handleQuestionChange('description', e.target.value)} required />
                <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                {questions[currentQuestionIndex].imageUrl && <img src={questions[currentQuestionIndex].imageUrl} alt="Uploaded" className="img-fluid mb-2 rounded" style={{ maxHeight: '150px' }} />}
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <input key={index} type="text" className="form-control mb-2" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required />
                ))}
                <select className="form-select mb-2" value={questions[currentQuestionIndex].correctAnswer} onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)} required>
                  <option value="">Select Correct Answer</option>
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <option key={index} value={option}>Option {index + 1}</option>
                  ))}
                </select>

                 {/* 🆕 Score Field */}
                 <input type="number" className="form-control mb-2" min="1" placeholder="Score" value={questions[currentQuestionIndex].score} onChange={(e) => handleScoreChange(parseInt(e.target.value))} required />

              </div>

              
              
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>
                <button type="button" className="btn btn-secondary" disabled={currentQuestionIndex === questions.length - 1} onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</button>
                <button type="button" className="btn btn-success" onClick={addQuestion}>Add Question</button>
                <button type="button" className="btn btn-danger" onClick={removeQuestion}>Remove Question</button>
              </div>
              
              <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isLoading || loading}>Create Quiz</button>
              {loading && <Loader />}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizScreen;