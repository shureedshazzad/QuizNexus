import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllCreatedQuizesQuery } from '../slices/quizesApiSlice';
import { Link } from 'react-router-dom';

function ViewAllCreatedQuizzes() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: quizzes = [], refetch , isLoading, error } = useGetAllCreatedQuizesQuery();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 6;

    // Refetch quizzes when the component mounts to get updated data
   useEffect(() => {
        refetch();
    }, []);
    

  if (isLoading) {
    return <div>Loading quizzes...</div>;
  }

  if (error) {
    return <div>Error fetching quizzes. Please try again.</div>;
  }

  // Filter quizzes created by the logged-in user
  const userQuizzes = quizzes.filter((quiz) => quiz.user_id._id === userInfo._id);

  // Pagination logic
  const totalPages = Math.ceil(userQuizzes.length / quizzesPerPage);
  const startIndex = (currentPage - 1) * quizzesPerPage;
  const endIndex = startIndex + quizzesPerPage;
  const currentQuizzes = userQuizzes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Your Created Quizzes</h1>
      
      <div className="mb-3 wow fadeInUp" data-wow-delay="0.1s">
        {currentQuizzes.length === 0 ? (
          <h3 className="text-center">No quizzes created yet</h3>
        ) : (
          <div className="row g-4">
            {currentQuizzes.map((quiz) => (
              <div key={quiz._id} className="col-lg-4 col-md-6">
                <div className="card p-3 shadow-sm">
                  <h5>Quiz Code: {quiz.quiz_code}</h5>
                  <p>
                    Status: {quiz.status === 'active' ? '✅ Active' : 
                    quiz.status === 'pending' ? '⏳ Pending' : 
                    '✔️ Completed'}
                  </p>
                  <Link to={`/view-quiz/${quiz._id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="text-center mt-4">
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default ViewAllCreatedQuizzes;