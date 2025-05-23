import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useViewQuizQuery } from '../slices/quizesApiSlice';
import Loader from '../components/Loader';
import { FaCheck, FaTimes, FaArrowLeft, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const Showleaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quizData, isLoading, isError } = useViewQuizQuery(id,{pollingInterval: 5000});
  // Sort participants with disqualified ones at the end
  const sortedParticipants = React.useMemo(() => {
    if (!quizData?.quiz?.leaderboard) return [];

    // Separate disqualified and qualified participants
    const disqualified = quizData.quiz.leaderboard.filter(p => p.isDisqualified);
    const qualified = quizData.quiz.leaderboard.filter(p => !p.isDisqualified);

    // Sort qualified participants normally
    const sortedQualified = [...qualified].sort((a, b) => {
      // 1. Sort by score (descending)
      if (b.score !== a.score) return b.score - a.score;
      
      // 2. Sort by number of correct answers (descending)
      const aCorrect = a.questionStatus?.filter(q => q.isCorrect).length || 0;
      const bCorrect = b.questionStatus?.filter(q => q.isCorrect).length || 0;
      if (bCorrect !== aCorrect) return bCorrect - aCorrect;
      
      // 3. Sort by duration (ascending)
      const aDuration = new Date(a.quizExitTime) - new Date(a.quizEntryTime);
      const bDuration = new Date(b.quizExitTime) - new Date(b.quizEntryTime);
      return aDuration - bDuration;
    });

    // Sort disqualified participants by disqualification time (if available) or keep original order
    const sortedDisqualified = [...disqualified].sort((a, b) => {
      return 0;
    });

    return [...sortedQualified, ...sortedDisqualified];
  }, [quizData]);

    if (isLoading) return <Loader />;
    if (isError) return toast.error('Error loading leaderboard');

    if (!sortedParticipants || sortedParticipants.length === 0) {
      return (
        <div className="container-xxl py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
            <div className="h-100 d-flex align-items-center p-5 bg-light shadow-lg rounded">
              <div className="w-100 text-center">
                <h3>No participants have joined this quiz yet</h3>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/')}
                >
                  <FaArrowLeft className="me-2" /> Return to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else{
      return(
        <div className="container-xxl py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
          <div className="h-100 p-5 bg-light shadow-lg rounded">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Leaderboard</h2>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                <FaArrowLeft className="me-2" /> Return to Homepage
              </button>
            </div>
            
            <div className="leaderboard-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {sortedParticipants.map((participant, index) => {
                const isDisqualified = participant.isDisqualified;
                const correctAnswers = isDisqualified 
                  ? '' 
                  : participant.questionStatus?.filter(q => q.isCorrect).length || 0;
                
                const duration = isDisqualified 
                  ? ''
                  : participant.quizExitTime 
                    ? ((new Date(participant.quizExitTime) - new Date(participant.quizEntryTime)) / 1000).toFixed(0) + 's'
                    : 'In progress';
  
                return (
                  <div 
                    key={participant.user_id?._id || index} 
                    className={`card mb-3 shadow-sm ${isDisqualified ? 'border-danger' : ''}`}
                    style={{ opacity: isDisqualified ? 0.7 : 1 }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="position-relative me-3">
                            <span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${isDisqualified ? 'bg-danger' : 'bg-primary'}`}>
                              {isDisqualified ? <FaBan /> : index + 1}
                            </span>
                            <img 
                              src={participant.user_id?.avatar || 'https://via.placeholder.com/50'} 
                              alt={participant.user_id?.userName} 
                              className="rounded-circle" 
                              width="50" 
                              height="50"
                              style={{ filter: isDisqualified ? 'grayscale(100%)' : 'none' }}
                            />
                          </div>
                          <div>
                            <h5 className={`mb-0 ${isDisqualified ? 'text-danger' : ''}`}>
                              {participant.user_id?.userName || 'Anonymous'}
                              {isDisqualified && (
                                <span className="badge bg-danger ms-2">
                                  <FaBan className="me-1" /> Disqualified
                                </span>
                              )}
                            </h5>
                            <small className={`text-muted ${isDisqualified ? 'text-danger' : ''}`}>
                              {correctAnswers} {!isDisqualified && 'correct'} • {duration}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          {!isDisqualified && (
                            <h4 className="mb-0 text-primary">{participant.score} pts</h4>
                          )}
                        </div>
                      </div>
                      
                      {!isDisqualified && (
                        <div className="d-flex flex-wrap mt-3">
                          {participant.questionOrder?.map((qIndex, i) => {
                            const questionStatus = participant.questionStatus?.find(q => q.questionIndex === qIndex);
                            let statusClass = 'bg-light';
                            let icon = null;
                            
                            if (questionStatus?.isAnswered) {
                              statusClass = questionStatus.isCorrect ? 'bg-success text-white' : 'bg-danger text-white';
                              icon = questionStatus.isCorrect ? <FaCheck /> : <FaTimes />;
                            }
                            
                            return (
                              <div 
                                key={i}
                                className={`rounded-circle d-flex align-items-center justify-content-center me-2 mb-2 ${statusClass}`}
                                style={{ width: '30px', height: '30px' }}
                                title={`Question ${i + 1}`}
                              >
                                {icon}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      )
    }
}

export default Showleaderboard