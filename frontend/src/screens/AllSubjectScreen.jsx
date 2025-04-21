import React, { useState } from 'react';
import { Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useGetAllSubjectsQuery, useDeleteSubjectMutation } from '../slices/subjectsApiSlice';
import CreateSubjectModal from '../components/createSubjectModal';
import { toast } from 'react-toastify';
import { Trash } from 'react-bootstrap-icons';

const AllSubjectScreen = () => {
  const { data, isLoading, error, refetch } = useGetAllSubjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteSubject] = useDeleteSubjectMutation();
  const [showModal, setShowModal] = useState(false);

  const handleCreateClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    refetch(); // Refetch subjects after modal is closed (new subject might have been added)
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(id).unwrap();
        toast.success('Subject deleted successfully');
        refetch(); // Refresh after deletion
      } catch (err) {
        toast.error(err?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 wow fadeIn" data-wow-delay="0.1s">
        <h2>All Subjects</h2>
        <Button onClick={handleCreateClick} className="btn btn-primary">
          Create Subject
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="alert alert-danger wow fadeIn" data-wow-delay="0.2s">
          {error.data?.message || 'Failed to load subjects'}
        </div>
      ) : (
        <Row className="wow fadeIn" data-wow-delay="0.2s">
          {data?.subjects?.length > 0 ? (
            data.subjects.map((subject) => (
              <Col key={subject._id} md={4} sm={6} className="mb-4">
                <Card className="h-100 shadow rounded-3 position-relative">
                  <Card.Body>
                    <Card.Title className="text-center">{subject.subjectName}</Card.Title>
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={() => handleDelete(subject._id)}
                    >
                      <Trash />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center w-100">No subjects found.</div>
          )}
        </Row>
      )}

      <CreateSubjectModal show={showModal} onHide={handleCloseModal} />
    </Container>
  );
};

export default AllSubjectScreen;
