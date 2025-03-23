import React, { useState } from 'react';
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

  const [joinQuiz, { isLoading, isError, error }] = useJoinQuizMutation();


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await joinQuiz({ user_id: userInfo._id,quizCode}).unwrap();
      console.log('Joined quiz successfully:', response);
      toast.success('You have joined the quiz!');
      navigate('/join-quiz');
      onHide(); // Close the modal after successful joi
    } catch (err) {
      console.error('Failed to join quiz:', err);
    }
    finally {
        setLoading(false);
    }

  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="wow fadeIn" data-wow-delay="0.1s">Join a Quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isLoading || loading}>Join Quiz</button>
            {loading && <Loader />}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default JoinQuizModal;