import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useCreateSubjectsMutation } from '../slices/subjectsApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from './Loader';

const CreateSubjectModal = ({ show, onHide }) => {
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(false);

  const [createSubject, { isLoading, isError, error }] = useCreateSubjectsMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createSubject({ subjectName: subjectName }).unwrap();
      toast.success('Subject is created succesfully');
      navigate('/');
      onHide();
    } catch (err) {
      console.error('Failed to create quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="wow fadeIn" data-wow-delay="0.1s">Create a subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="subjectName" className="wow fadeIn" data-wow-delay="0.2s">
            <Form.Label>Enter Subject Name</Form.Label>
            <Form.Control
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </Form.Group>

          {isError && (
            <Alert variant="danger" className="mt-3 wow fadeIn" data-wow-delay="0.3s">
              {error.data?.message || 'Failed to create quiz'}
            </Alert>
          )}

          <div className="d-flex justify-content-end mt-3 wow fadeIn" data-wow-delay="0.4s">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <button className="btn btn-primary w-100 mt-3" type="submit" disabled={isLoading || loading}>
              Create Subject
            </button>
            {loading && <Loader />}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSubjectModal;