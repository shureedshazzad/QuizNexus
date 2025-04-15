import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

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
  marginLeft: "2rem",
};


const Profilescreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');


  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.userName);
      setEmail(userInfo.email);
      setAvatar(userInfo.avatar);
    }
  }, [userInfo]);



  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <div 
          className="h-100 d-flex align-items-center py-5 px-4 px-md-5 wow fadeInUp" 
          data-wow-delay="0.1s"
          style={backgroundStyle}
        >
          {/* Profile Form */}
          <div style={{ flex: 1 }}>
            <h2 className="mb-4 text-center wow fadeInUp" data-wow-delay="0.2s">Profile</h2>
            <div className="row g-3">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.3s">
                <label>Username:</label>
                <input 
                  type="text" 
                  className="form-control border-0" 
                  value={userName} 
                  readOnly 
                />
              </div>
              <div className="col-12 wow fadeInUp" data-wow-delay="0.4s">
                <label>Email:</label>
                <input 
                  type="text" 
                  className="form-control border-0" 
                  value={email} 
                  readOnly 
                />
              </div>
              <div className="col-12 mt-3 wow fadeInUp" data-wow-delay="0.7s">
                <LinkContainer to={`/show-user/${userInfo?._id}`}>
                  <Button variant="info" className="w-100">
                    <FontAwesomeIcon icon={faInfo} className="me-2" />
                    View Joinnd Quiz Info
                  </Button>
                </LinkContainer>
              </div>
            </div>
          </div>

          {/* Avatar Image */}
          <div className="wow fadeInUp" data-wow-delay="0.8s">
            <img
              src={avatar || "https://via.placeholder.com/150"}
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