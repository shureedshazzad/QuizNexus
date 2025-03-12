import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const backgroundStyle = {
  background: "#E7E8D8",
  borderRadius: "16px",
  boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)",
  padding: "2rem",
};

const avatarStyle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  objectFit: "cover",
  marginLeft: "2rem", // Adjusted margin for better spacing
};

const progressBarStyle = {
  height: "20px",
  borderRadius: "10px",
  backgroundColor: "#f0f0f0",
  overflow: "hidden",
  position: "relative",
};

const progressFillStyle = (percentage) => ({
  height: "100%",
  width: `${percentage}%`,
  background: `linear-gradient(90deg, #4CAF50, #8BC34A)`, // Gradient color
  borderRadius: "10px",
  transition: "width 0.5s ease-in-out", // Smooth animation
});

const progressLabelStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "#000",
  fontWeight: "bold",
};

const Profilescreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [level, setLevel] = useState('');
  const [total_score, setTotalScore] = useState(0);

  const { userInfo } = useSelector((state) => state.auth);

  console.log("User Info:", userInfo);

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.userName);
      setEmail(userInfo.email);
      setAvatar(userInfo.avatar);
      setLevel(userInfo.level);
      setTotalScore(userInfo.total_score || 0); // Fallback to 0 if total_score is missing
    }
  }, [userInfo]);

  // Calculate progress percentage based on score and level
  const calculateProgress = () => {
    let maxScore;
    switch (level) {
      case "Brainy Beginner":
        maxScore = 100;
        break;
      case "Rising Quizzer":
        maxScore = 200;
        break;
      case "Quiz Conqueror":
        maxScore = 300;
        break;
      case "Knowledge Kingpin":
        maxScore = 400;
        break;
      case "Quiz Maestro":
        maxScore = 500;
        break;
      case "Knowledge Emperor":
        maxScore = 1000; // Expert has no upper limit, but we use 1000 for consistency
        break;
      default:
        maxScore = 100; // Default to Beginner
    }

    // Calculate progress within the current level
    const levelStartScore = {
      "Brainy Beginner": 0,
      "Rising Quizzer": 100,
      "Quiz Conqueror": 200,
      "Knowledge Kingpin": 300,
      "Quiz Maestro": 400,
      "Knowledge Emperor": 500,
    }[level];

    const progressInLevel = total_score - levelStartScore;
    return (progressInLevel / (maxScore - levelStartScore)) * 100;
  };

  // Determine progress bar color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "green";
    if (percentage >= 50) return "orange";
    return "red";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Full viewport height
        backgroundColor: "#f8f9fa", // Light background for the page
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <div className="h-100 d-flex align-items-center py-5 px-4 px-md-5" style={backgroundStyle}>
          {/* Profile Form */}
          <div style={{ flex: 1 }}>
            <h2 className="mb-4 text-center">Profile</h2>
            <div className="row g-3">
              <div className="col-12">
                <label>Username:</label>
                <input type="text" className="form-control border-0" value={userName} readOnly />
              </div>
              <div className="col-12">
                <label>Email:</label>
                <input type="text" className="form-control border-0" value={email} readOnly />
              </div>
              <div className="col-12">
                <label>Level:</label>
                <input type="text" className="form-control border-0" value={level} readOnly />
              </div>
              <div className="col-12">
                <label>Total Score:</label>
                <input type="number" className="form-control border-0" value={total_score} readOnly />
              </div>
              <div className="col-12">
                <label>Progress:</label>
                <div style={progressBarStyle}>
                  <div
                    style={{
                      ...progressFillStyle(calculateProgress()),
                      background: getProgressColor(calculateProgress()), // Dynamic color
                    }}
                  ></div>
                  <div style={progressLabelStyle}>
                    {calculateProgress().toFixed(2)}% {/* Display progress percentage */}
                  </div>
                </div>
                <small>
                  {total_score} / {level === "Knowledge Emperor" ? "∞" : "Next Level"} points ({level})
                </small>
              </div>
            </div>
          </div>

          {/* Avatar Image */}
          <div>
            <img
              src={avatar || "https://via.placeholder.com/150"} // Default placeholder if no avatar
              alt="User Avatar"
              style={avatarStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilescreen;