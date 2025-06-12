import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JoinQuizModal from './JoinQuizModal'; // Import the JoinQuizModal component
import { useSelector } from 'react-redux';
import './navDesign.css';

function Features() {
  const [showJoinQuizModal, setShowJoinQuizModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  

  const getCreateQuizPath = () => userInfo ? '/create-quiz' : '/login';
  const getAiChallengePath = () => userInfo ? '/all-subject' : '/login';

  const containerStyle = {
    width: '100%',
    maxWidth: '900px',
  };

  const circleStyle = {
    width: '65px',
    height: '65px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  };

  const cardStyle = {
    background: "#E7E8D8",
    borderRadius: "16px",
    boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)",
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  };

  const contentStyle = {
    flexGrow: 1,
  };

  const buttonStyle = {
    backgroundColor: '#ff5733',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
    textDecoration: 'none',
    alignSelf: 'center',
  };

  return (
    <>
      <div className="container-xxl py-5" id="features">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={containerStyle}>
            <h1>Our Features</h1>
          </div>
          <div className="row g-4">
            
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
             <div className="service-item h-100 p-5" style={cardStyle}>
              <div style={contentStyle}>
                <div style={circleStyle} className="service-icon">
                  <i className="fa fa-users text-primary fs-4"></i>
                </div>
                <h4 className="mb-3 mt-2">Join A Quiz</h4>
                <p className="mb-4">Participate in a wide variety of exciting quizzes to test your knowledge on various topics. With every quiz, challenge yourself and improve your skills in a fun and engaging way</p>
                </div>
                <button
                style={buttonStyle}
                onClick={() => {
                  if (userInfo) {
                    setShowJoinQuizModal(true);
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Try It
                </button>
              </div>
            </div>
            {/* Create Quizzes */}


            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item h-100 p-5" style={cardStyle}>
                <div style={contentStyle}>
                  <div style={circleStyle} className="service-icon">
                    <i className="fa fa-pencil-alt text-warning fs-4"></i>
                  </div>
                  <h4 className="mb-3 mt-2">Create A Quiz</h4>
                  <p className="mb-4">Create and design your own quizzes to challenge others. Customize questions, and create quizzes based on your interests.</p>
                </div>
                <Link to={getCreateQuizPath()} style={buttonStyle}>Try It</Link>
              </div>
            </div>

            {/* AI Challenge */}
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item h-100 p-5" style={cardStyle}>
                <div style={contentStyle}>
                  <div style={circleStyle} className="service-icon">
                    <i className="fa fa-robot text-success fs-4"></i>
                  </div>
                  <h4 className="mb-3 mt-2">Adaptive Learning with AI</h4>
                  <p className="mb-4">Master topics efficiently with AI-powered adaptive learning. Our smart system analyzes your performance and customizes quiz difficulty in real time—helping you improve faster and stay engaged like never before.</p>
                </div>
                <Link to={getAiChallengePath()} style={buttonStyle}>Try It</Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      <JoinQuizModal
        show={showJoinQuizModal}
        onHide={() => setShowJoinQuizModal(false)}
      />
    </>
  );
}

export default Features;
