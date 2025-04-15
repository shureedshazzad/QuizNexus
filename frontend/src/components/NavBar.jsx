import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaHome, FaPlayCircle, FaPlusCircle, FaRobot, FaSignInAlt, FaUser, FaSignOutAlt, FaClipboardList, FaUsers } from 'react-icons/fa';
import JoinQuizModal from './JoinQuizModal'; // Import the JoinQuizModal component

import './navDesign.css';

const logoStyle = {
  height: "50px",
  width: "50px",
};

const logoTextStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#FFBF1A",
  marginLeft: "10px",
  display: "inline-block",
};

function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false); // For dropdown visibility
  const [showJoinQuizModal, setShowJoinQuizModal] = useState(false); // State to control modal visibility

  const logoutHandler = async () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");

    if (confirmed) {
      try {
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/login');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const location = useLocation();
  const isQuizPage = location.pathname.startsWith('/answer-quiz');
  const isAdmin = userInfo?.isAdmin
  console.log(isAdmin);
  console.log(userInfo);


  if(isQuizPage)
  {
    return(
    <nav className="navbar navbar-expand-lg navbar-light sticky-top p-0 wow fadeIn" data-wow-delay="0.1s" style={styles.back}>
      <div className="navbar-brand d-flex align-items-center px-4 px-lg-5">
        <div style={{ marginTop: '5px' }}>
          <img src="/images/logo.png" alt="Logo" className="mr-2" style={logoStyle} />
        </div>
        <div style={logoTextStyle}>QuizNexus</div>
      </div>

      <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <div className="nav-item nav-link">
            <FaHome className="nav-icon" /> Home
          </div>

          {/* Join a Quiz Button */}
          <button
            className="nav-item nav-link btn btn-link"
            //onClick={() => setShowJoinQuizModal(true)} // Open the modal
            style={{ border: 'none', background: 'transparent', textDecoration: 'none' }}
          >
            <FaPlayCircle className="nav-icon" /> Join a Quiz
          </button>

          <div className="nav-item nav-link">
            <FaPlusCircle className="nav-icon" /> Create a Quiz
          </div>

          <div className="nav-item nav-link">
            <FaRobot className="nav-icon" /> Challenge AI
          </div>

          {/* Conditional Rendering for Logged-in User */}
          {userInfo ? (
            <div className="nav-item dropdown">
              <button
                className="btn btn-link nav-link"
                style={{ position: 'relative', border: 'none', background: 'transparent' }}
              >
                <img
                  src={userInfo.avatar || "/images/default-avatar.png"}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #FFBF1A' }}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, background: '#EEEDEB', borderRadius: '10px', boxShadow: '0px 5px 10px rgba(0,0,0,0.1)' }}>
                  <Link to="/profile" className="dropdown-item">
                    <FaUser className="me-2" /> Profile
                  </Link>
                  <button onClick={logoutHandler} className="dropdown-item text-danger">
                    <FaSignOutAlt className="me-2" /> 
                    Logout
                  </button>
                  <Link to="/view-all-created-quizes" className="dropdown-item">
                     <FaClipboardList className="me-2" /> My Quizzes
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="btn btn-dark rounded-0 py-3 px-lg-4">
              <FaSignInAlt className="me-2" /> Sign In
            </div>
          )}
        </div>
      </div>
    </nav>
    )
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top p-0 wow fadeIn" data-wow-delay="0.1s" style={styles.back}>
      <Link to='/' className="navbar-brand d-flex align-items-center px-4 px-lg-5">
        <div style={{ marginTop: '5px' }}>
          <img src="/images/logo.png" alt="Logo" className="mr-2" style={logoStyle} />
        </div>
        <div style={logoTextStyle}>QuizNexus</div>
      </Link>

      <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <Link to='/' className="nav-item nav-link">
            <FaHome className="nav-icon" /> Home
          </Link>

          {/* Join a Quiz Button */}
          <button
            className="nav-item nav-link btn btn-link"
            onClick={() => setShowJoinQuizModal(true)} // Open the modal
            style={{ border: 'none', background: 'transparent', textDecoration: 'none' }}
          >
            <FaPlayCircle className="nav-icon" /> Join a Quiz
          </button>

          <Link to='/create-quiz' className="nav-item nav-link">
            <FaPlusCircle className="nav-icon" /> Create a Quiz
          </Link>

          <Link to='/challenge' className="nav-item nav-link">
            <FaRobot className="nav-icon" /> Challenge AI
          </Link>

          {/* Conditional Rendering for Logged-in User */}
          {userInfo ? (
            <div className="nav-item dropdown">
              <button
                className="btn btn-link nav-link"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ position: 'relative', border: 'none', background: 'transparent' }}
              >
                <img
                  src={userInfo.avatar || "/images/default-avatar.png"}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #FFBF1A' }}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, background: '#EEEDEB', borderRadius: '10px', boxShadow: '0px 5px 10px rgba(0,0,0,0.1)' }}>
                  <Link to="/profile" className="dropdown-item">
                    <FaUser className="me-2" /> Profile
                  </Link>
                  <button onClick={logoutHandler} className="dropdown-item text-danger">
                    <FaSignOutAlt className="me-2" /> 
                    Logout
                  </button>


                     {/* Admin-specific dropdown items */}
              {isAdmin && (
                 <>
                  <Link to="/admin/users" className="dropdown-item">
                    <FaUsers className="me-2" /> Manage Users
                  </Link>
                 </>
               )}


                  <Link to="/view-all-created-quizes" className="dropdown-item">
                     <FaClipboardList className="me-2" /> My Quizzes
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-dark rounded-0 py-3 px-lg-4">
              <FaSignInAlt className="me-2" /> Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Join Quiz Modal */}
      <JoinQuizModal
        show={showJoinQuizModal}
        onHide={() => setShowJoinQuizModal(false)} // Close the modal
      />
    </nav>
  );
}

const styles = {
  back: {
    background: "#EEEDEB"
  }
};

export default Navbar;