import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGenerateQuestionMutation,
  useUpdateProgressMutation,
} from "../slices/aiApiSlice";
import {
  Card,
  Button,
  Spinner,
  Container,
  Form,
  Badge,
  Row,
  Col
} from "react-bootstrap";
import { toast } from "react-toastify";
import { 
  FaClock, 
  FaPaperPlane, 
  FaLightbulb,
  FaRobot,
  FaUser
} from "react-icons/fa";

const Aibasedadaptivelearningscreen = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [generateQuestion, { isLoading: generating }] = useGenerateQuestionMutation();
  const [updateProgress, { isLoading: updating }] = useUpdateProgressMutation();

  const [endTime, setEndTime] = useState(() => {
    const storedEndtime = localStorage.getItem("quizDuration");
    return storedEndtime
      ? new Date(storedEndtime)
      : new Date(Date.now() + 5 * 60 * 1000);
  });

const [countdown, setCountdown] = useState(() => {
  const storedEndtime = localStorage.getItem("quizDuration");
  return storedEndtime
    ? Math.max(0, Math.floor((new Date(storedEndtime) - Date.now()) / 1000))
    : 5 * 60;
});



  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const storedEndtime = localStorage.getItem("quizDuration");
    if (!storedEndtime) {
      const newEndTime = new Date(Date.now() + 5 * 60 * 1000);
      setEndTime(newEndTime);
      localStorage.setItem("quizDuration", newEndTime);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        localStorage.removeItem("quizDuration");
        toast.error("Quiz Ended");
        clearInterval(interval);
        navigate(`/feedback/${subjectId}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, navigate, subjectId]);

  const handleGenerateQuestion = async () => {
    try {
      setShowExplanation(false);
      setExplanation("");
      const res = await generateQuestion({
        userId: userInfo._id,
        subjectId,
      }).unwrap();
      setCurrentQuestion(res.questionText);
      setQuestionId(res.questionId);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate question");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.warning("Please enter an answer");
      return;
    }
    try {
      const res = await updateProgress({
        userId: userInfo._id,
        subjectId,
        questionId,
        questionText: currentQuestion,
        userAnswer: answer,
      }).unwrap();

      toast.success(res.message || "Answer submitted");
      setExplanation(res.explanation);
      setShowExplanation(true);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit answer");
    }
  };

  const handleNextQuestion = () => {
    setAnswer("");
    setCurrentQuestion("");
    setQuestionId(null);
    setExplanation("");
    setShowExplanation(false);
    handleGenerateQuestion();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  return (
    <Container className="py-4 d-flex justify-content-center">
      <div className="col-lg-8 wow fadeInUp mx-auto" data-wow-delay="0.1s">
        <Card className="shadow-sm border-0 rounded-4 mb-4">
          <Card.Header className="bg-primary text-white rounded-top-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaRobot className="me-2" />
              AI Learning Session
            </h5>
            <Badge bg="light" text="dark" pill>
              <FaClock className="me-1" />
              {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
            </Badge>
          </Card.Header>
          
          <Card.Body className="p-4">
            {!currentQuestion && !showExplanation && (
              <div className="text-center py-5">
                <FaLightbulb className="text-warning mb-3" size={48} />
                <h5>Ready to start learning?</h5>
                <p className="text-muted mb-4">
                  Click the button below to get your first question
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-4"
                  onClick={handleGenerateQuestion}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Question"
                  )}
                </Button>
              </div>
            )}

            {currentQuestion && !showExplanation && (
              <div className="mb-4">
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-info bg-opacity-10 d-flex align-items-center">
                    <FaRobot className="me-2 text-info" />
                    <span className="fw-bold">AI Question</span>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">{currentQuestion}</p>
                  </Card.Body>
                </Card>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <FaUser className="me-2" />
                    Your Answer
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer here..."
                    className="border-2"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || updating}
                  >
                    {updating ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {showExplanation && (
              <div className="mb-4">
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-info bg-opacity-10 d-flex align-items-center">
                    <FaRobot className="me-2 text-info" />
                    <span className="fw-bold">AI Explanation</span>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">{explanation}</p>
                  </Card.Body>
                </Card>

                <Row className="g-3">
                  <Col md={6}>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="w-100 rounded-pill"
                      onClick={() => {
                        setShowExplanation(false);
                        setAnswer("");
                      }}
                    >
                      Try Again
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 rounded-pill"
                      onClick={handleNextQuestion}
                    >
                      Next Question
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {(generating || updating) && !currentQuestion && !showExplanation && (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Aibasedadaptivelearningscreen;