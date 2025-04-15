import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserDetailsQuery } from '../slices/usersApiSlice';
import { useViewJoinedQuizQuery } from '../slices/quizesApiSlice';
import Loader from '../components/Loader';
import { FaArrowLeft, FaTrophy, FaCheck, FaTimes, FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch user details
  const { 
    data: userData, 
    isLoading: userLoading, 
    error: userError 
  } = useGetUserDetailsQuery(id);

  // Fetch joined quizzes
  const { 
    data: quizzesResponse,
    isLoading: quizzesLoading, 
    error: quizzesError 
  } = useViewJoinedQuizQuery(id);

  if (userLoading || quizzesLoading) return <Loader />;

  // Extract quizzes array from response
  const joinedQuizzes = quizzesResponse?.joinedQuizzes || quizzesResponse?.data || quizzesResponse || [];

  if (userError) {
    toast.error('Error loading user details');
    return null;
  }

  if (quizzesError) {
    toast.error('Error loading joined quizzes');
    return null;
  }

  // Function to find user's position in a quiz leaderboard
  const getUserLeaderboardPosition = (quiz) => {
    if (!quiz?.leaderboard) return null;
    
    // Separate disqualified and qualified participants
    const qualifiedParticipants = quiz.leaderboard.filter(p => !p.isDisqualified);
    const disqualifiedParticipants = quiz.leaderboard.filter(p => p.isDisqualified);

    // Sort qualified participants
    const sortedQualified = [...qualifiedParticipants].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aCorrect = a.questionStatus?.filter(q => q.isCorrect).length || 0;
      const bCorrect = b.questionStatus?.filter(q => q.isCorrect).length || 0;
      if (bCorrect !== aCorrect) return bCorrect - aCorrect;
      const aDuration = new Date(a.quizExitTime) - new Date(a.quizEntryTime);
      const bDuration = new Date(b.quizExitTime) - new Date(b.quizEntryTime);
      return aDuration - bDuration;
    });

    // Combine with disqualified at the end
    const sortedLeaderboard = [...sortedQualified, ...disqualifiedParticipants];

    // Find user's position
    const userIndex = sortedLeaderboard.findIndex(
      participant => participant.user_id.toString() === id
    );

    return userIndex >= 0 ? userIndex + 1 : null;
  };

  // Function to get participant data
  const getParticipantData = (quiz) => {
    return quiz.leaderboard?.find(p => p.user_id.toString() === id);
  };

  // Function to check if participant is disqualified
  const isDisqualified = (quiz) => {
    const participant = getParticipantData(quiz);
    return participant?.isDisqualified || false;
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" /> Back
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-2 text-center">
              <img 
                src={userData?.avatar || 'https://via.placeholder.com/150'} 
                alt={userData?.userName} 
                className="rounded-circle img-fluid" 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-10">
              <h2>{userData?.userName}</h2>
              <p className="text-muted mb-1">{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Joined Quizzes Section */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Joined Quizzes</h4>
        </div>
        <div className="card-body">
          {joinedQuizzes?.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">This user hasn't joined any quizzes yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Quiz Code</th>
                    <th>Quiz Name</th>
                    <th>Status</th>
                    <th>Position</th>
                    <th>Score</th>
                    <th>Question Status</th>
                  </tr>
                </thead>
                <tbody>
                  {joinedQuizzes?.map((quiz) => {
                    const participant = getParticipantData(quiz);
                    const disqualified = isDisqualified(quiz);
                    const position = getUserLeaderboardPosition(quiz);
                    const isCompleted = quiz.quiz_end_time && new Date(quiz.quiz_end_time) < new Date();

                    return (
                      <tr 
                        key={quiz._id} 
                        className={disqualified ? 'table-danger' : ''}
                        style={{ opacity: disqualified ? 0.7 : 1 }}
                      >
                        <td>{quiz.quiz_code}</td>
                        <td>
                          {quiz.quiz_name}
                          {disqualified && (
                            <span className="badge bg-danger ms-2">
                              <FaBan className="me-1" /> Disqualified
                            </span>
                          )}
                        </td>
                        <td>
                          {isCompleted ? (
                            <span className="badge bg-success">Completed</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Active</span>
                          )}
                        </td>
                        <td>
                          {disqualified ? (
                            <span className="badge bg-danger">
                              <FaBan className="me-1" /> DQ
                            </span>
                          ) : position ? (
                            <span className="badge bg-primary">
                              <FaTrophy className="me-1" /> {position}
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>
                          {disqualified ? (
                            <span className="badge bg-secondary">DQ</span>
                          ) : (
                            <span className="badge bg-secondary">{participant?.score || 0} pts</span>
                          )}
                        </td>
                        <td>
                          {disqualified ? (
                            <span className="text-muted">Disqualified</span>
                          ) : participant?.questionOrder ? (
                            <div className="d-flex flex-wrap">
                              {participant.questionOrder.map((qIndex, i) => {
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
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;