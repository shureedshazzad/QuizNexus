
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useShowProgressQuery } from '../slices/subjectsApiSlice';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Spinner, 
  Alert, 
  Container, 
  Image 
} from 'react-bootstrap';
import { 
  FaCheckCircle, 
  FaChartLine, 
  FaBolt, 
  FaRedo, 
  FaStar 
} from 'react-icons/fa';

const ProgressScreen = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: progress,
    isLoading,
    error,
  } = useShowProgressQuery({ userId: userInfo._id, subjectId });

  const handleStartQuiz = () => {
    localStorage.removeItem('quizDuration');
    navigate(`/quiz/${subjectId}`);
  };

  // Calculate success rate safely
  const successRate = progress?.success_rate ?? 0;

  return (
    <Container className="py-4 d-flex justify-content-center">
      <div className="col-lg-8 wow fadeInUp mx-auto" data-wow-delay="0.1s">
        <h2 className="mb-3 text-center">📊 Your Learning Progress</h2>
        <p className="lead text-center">
          Welcome back, <strong>{userInfo?.name}</strong>! Here's how you've been doing in this subject.
        </p>

        {isLoading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error?.data?.message || 'Something went wrong'}
          </Alert>
        ) : (
          <>
            <Row className="mb-4 align-items-center justify-content-center">
              <Col md={3} className="text-center">
                <Image
                  src={progress?.user?.avatar || '/images/default-avatar.png'}
                  alt="Avatar"
                  roundedCircle
                  width="100"
                  height="100"
                  className="shadow-sm"
                />
              </Col>
              <Col md={6}>
                <h4 className="text-center">{progress?.user?.name}</h4>
                <p className="text-muted text-center">
                  Subject: <strong>{progress?.subject?.subjectName}</strong>
                </p>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={4}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaCheckCircle className="text-success mb-2" size={30} />
                    <Card.Title>Correct Answers</Card.Title>
                    <Card.Text>{progress?.correctAnswers || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaRedo className="text-warning mb-2" size={30} />
                    <Card.Title>Total Attempts</Card.Title>
                    <Card.Text>{progress?.totalAttempts || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaBolt className="text-danger mb-2" size={30} />
                    <Card.Title>Current Streak</Card.Title>
                    <Card.Text>{progress?.currentStreak || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaStar className="text-info mb-2" size={30} />
                    <Card.Title>Max Streak</Card.Title>
                    <Card.Text>{progress?.maxStreak || 0}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaChartLine className="text-primary mb-2" size={30} />
                    <Card.Title>Success Rate</Card.Title>
                    <Card.Text>{successRate.toFixed(2)}%</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center shadow-sm border-0 rounded-4 mb-4">
                  <Card.Body>
                    <FaChartLine className="text-secondary mb-2" size={30} />
                    <Card.Title>Last Attempt</Card.Title>
                    <Card.Text>
                      {progress?.lastAttemptedAt
                        ? new Date(progress.lastAttemptedAt).toLocaleString()
                        : 'Not attempted yet'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button
                variant="success"
                size="lg"
                className="rounded-pill px-4 py-2"
                onClick={handleStartQuiz}
              >
                🚀 Let's Try!
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default ProgressScreen;