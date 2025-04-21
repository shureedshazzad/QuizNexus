import React from 'react';
import { useGetAllSubjectsQuery } from '../slices/subjectsApiSlice';
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { FaRobot, FaLightbulb, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SubjectChoiceScreen = () => {
  const { data, isLoading, error } = useGetAllSubjectsQuery();
  const navigate = useNavigate();

  const handleSubjectSelect = (subjectId) => {
    navigate(`/progress/${subjectId}`);
  };

  // Inline style for hover effect using CSS-in-JS approach
  const cardStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    e.currentTarget.style.backgroundColor = '#f8f9fa';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    e.currentTarget.style.backgroundColor = '#fff';
  };

  return (
    <Container className="py-4">
      <div className="col-lg-8 wow fadeInUp" data-wow-delay="0.1s">
        <h2 className="mb-3">📚 Choose a Subject for AI-Based Adaptive Learning!</h2>

        <p className="lead">
          <FaRobot className="me-2 text-primary" />
          Ready to level up your learning journey with an AI companion? Here's how it works:
        </p>
        <ul>
          <li>
            <FaLightbulb className="me-2 text-warning" />
            Based on your performance (✅ correct answers, 🔁 streaks, and 📈 scores), our AI adapts the difficulty level!
          </li>
          <li>
            <FaChartLine className="me-2 text-info" />
            Track your progress and improve gradually with personalized challenges!
          </li>
          <li>
            <FaCheckCircle className="me-2 text-success" />
            Stay motivated with streaks and high scores — let's gamify learning! 🎮✨
          </li>
        </ul>
      </div>

      <div className="wow fadeInUp" data-wow-delay="0.2s">
        <h4 className="mt-4 mb-3">🎯 Available Subjects</h4>
        {isLoading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error.data?.message || 'Failed to load subjects'}</Alert>
        ) : (
          <Row>
            {data?.subjects?.length > 0 ? (
              data.subjects.map((subject) => (
                <Col key={subject._id} md={4} sm={6} className="mb-4 wow fadeIn" data-wow-delay="0.3s">
                  <Card
                    className="h-100 shadow-sm rounded-4 text-center border-0"
                    style={cardStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleSubjectSelect(subject._id)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-center">
                      <Card.Title>{subject.subjectName}</Card.Title>
                      <Card.Text className="text-muted">Click to Start</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <div className="text-center w-100">No subjects available. Please stay tuned 😞</div>
            )}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default SubjectChoiceScreen;
