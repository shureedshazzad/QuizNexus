import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useJoinQuizMutation } from '../slices/quizesApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from './Loader';

const JoinQuizModal = ({ show, onHide }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [quizCode, setQuizCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [joinQuiz, { isLoading, isError, error }] = useJoinQuizMutation();
  const navigate = useNavigate();

  // Show cheating warning when modal opens
  useEffect(() => {
    if (show) {
      setShowWarning(true);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await joinQuiz({ user_id: userInfo._id, quizCode }).unwrap();
      toast.success('You have joined the quiz!');
      
      // Show final warning before entering quiz

      localStorage.removeItem('quizCompleted');
      navigate(`/answer-quiz/${response.quizId}`);
      onHide();
    } catch (err) {
      console.error('Failed to join quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="wow fadeIn" data-wow-delay="0.1s">Join a Quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showWarning && (
          <Alert variant="warning" className="wow fadeIn" data-wow-delay="0.15s">
            <Alert.Heading>⚠️ Anti-Cheating Policy</Alert.Heading>
            <p>
              <b>Our system detects and automatically disqualifies:</b>
            </p>
            <ul>
              <li>Tab/window switching during the quiz</li>
              <li>Attempts to open new browser windows</li>
            </ul>
            <p className="mb-0">
              <span style={{ fontSize: '1.2em' }}>🔍</span> All activity is monitored and recorded
            </p>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="quizCode" className="wow fadeIn" data-wow-delay="0.2s">
            <Form.Label>Enter Quiz Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., ABC123"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              required
            />
          </Form.Group>

          {isError && (
            <Alert variant="danger" className="mt-3 wow fadeIn" data-wow-delay="0.3s">
              {error.data?.message || 'Failed to join quiz'}
            </Alert>
          )}

          <div className="d-flex justify-content-end mt-3 wow fadeIn" data-wow-delay="0.4s">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isLoading || loading}>
              Join Quiz
            </button>
            {loading && <Loader />}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default JoinQuizModal;