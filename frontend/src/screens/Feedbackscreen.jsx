import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProvideFeedbackMutation } from '../slices/aiApiSlice';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Spinner, 
  Alert, 
  Container, 
  Image,
  Badge
} from 'react-bootstrap';
import { 
  FaBookOpen, 
  FaChartLine, 
  FaLightbulb, 
  FaHome,
  FaUserGraduate
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Feedbackscreen = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [provideFeedback, { data: feedback, isLoading, error }] = useProvideFeedbackMutation();

  useEffect(() => {
    if (userInfo && subjectId) {
      provideFeedback({ userId: userInfo._id, subjectId });
    }
  }, [userInfo, subjectId, provideFeedback]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || 'Failed to fetch feedback');
    }
  }, [error]);

  return (
    <Container className="py-4 d-flex justify-content-center">
      <div className="col-lg-8 wow fadeInUp mx-auto" data-wow-delay="0.1s">
        <h2 className="mb-3 text-center">🧠 AI Learning Feedback</h2>
        <p className="lead text-center">
          Hello, <strong>{userInfo?.name}</strong>! Here's your personalized feedback for this subject.
        </p>

        {isLoading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error?.data?.message || 'Failed to load feedback'}
          </Alert>
        ) : feedback ? (
          <>
            <Row className="mb-4 align-items-center justify-content-center">
              <Col md={3} className="text-center">
                <Image
                  src={feedback.avatar || '/images/default-avatar.png'}
                  alt="Avatar"
                  roundedCircle
                  width="100"
                  height="100"
                  className="shadow-sm border border-3 border-primary"
                />
              </Col>
              <Col md={6}>
                <h4 className="text-center">{feedback.user}</h4>
                <p className="text-muted text-center">
                  <FaBookOpen className="me-2" />
                  Subject: <strong>{feedback.subject}</strong>
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center mb-4">
              <Col md={6}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaChartLine className="text-primary mb-2" size={30} />
                    <Card.Title>Success Rate</Card.Title>
                    <Card.Text>
                      <Badge bg="primary" pill>
                        {feedback.successRate}%
                      </Badge>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaUserGraduate className="text-success mb-2" size={30} />
                    <Card.Title>Performance Level</Card.Title>
                    <Card.Text>
                      <Badge bg={feedback.successRate > 70 ? 'success' : feedback.successRate > 40 ? 'warning' : 'danger'} pill>
                        {feedback.successRate > 70 ? 'Excellent' : feedback.successRate > 40 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="shadow-sm border-0 rounded-4 mb-4">
              <Card.Header className="bg-primary text-white rounded-top-4">
                <h5 className="mb-0">
                  <FaLightbulb className="me-2" />
                  AI-Generated Feedback
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="p-3 bg-light rounded-3">
                  <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                    {feedback.feedback}
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill px-4 py-2 me-3"
                onClick={() => navigate(`/quiz/${subjectId}`)}
              >
                🚀 Try Again
              </Button>
              <Link to="/">
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="rounded-pill px-4 py-2"
                >
                  <FaHome className="me-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </Container>
  );
};

export default Feedbackscreen;