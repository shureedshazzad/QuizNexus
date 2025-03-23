import React from 'react';
import { Link } from 'react-router-dom'

function Features() {
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
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Added a shadow for depth
    transition: 'transform 0.3s ease', // Added transition for hover effect
  };

  const backgroundStyle = {
    background: "#E7E8D8",
    borderRadius: "16px",
    boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)",
    padding: '20px', // Added padding for better content spacing
    textAlign: 'center', // Centered text
  }

  const buttonStyle = {
    backgroundColor: '#ff5733', // Orangered background
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#e04e00', // Darker shade on hover
  };

  return (
    <div className="container-xxl py-5" id="features">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={containerStyle}>
          <h1>Our Features</h1>
        </div>
        <div className="row g-4">
          {/* Join Quizzes Feature */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="service-item h-100 p-5" style={backgroundStyle}>
              <div style={circleStyle} className="service-icon">
                <i className="fa fa-users text-primary fs-4"></i>
              </div>
              <h4 className="mb-3 mt-2">Join Quizzes</h4>
              <p className="mb-4">Participate in a wide variety of exciting quizzes to test your knowledge on various topics. With every quiz, challenge yourself and improve your skills in a fun and engaging way.</p>
            </div>
          </div>

          {/* Make Quizzes Feature */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
  <div className="service-item h-100 p-5" style={backgroundStyle}>
    <div style={circleStyle} className="service-icon">
      <i className="fa fa-pencil-alt text-warning fs-4"></i>
    </div>
    <h4 className="mb-3 mt-2">Make Quizzes</h4>
    <p className="mb-4">
      Create and design your own quizzes to challenge others. Customize questions, and create quizzes based on your interests.
    </p>
  </div>
</div>


          {/* Challenge with AI Feature */}
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
            <div className="service-item h-100 p-5" style={backgroundStyle}>
              <div style={circleStyle} className="service-icon">
                <i className="fa fa-robot text-success fs-4"></i>
              </div>
              <h4 className="mb-3 mt-2">Challenge with AI</h4>
              <p className="mb-4">Take your skills to the next level by challenging AI-powered opponents. Grow your expertise as you advance through different levels of difficulty in the AI challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
