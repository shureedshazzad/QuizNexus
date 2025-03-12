import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const backgroundStyle = {
  background: "#E7E8D8",
  borderRadius: "16px",
  boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)"
};

function Registerscreen() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();


    // Generate a unique avatar when userName is set
  useEffect(() => {
     if (email) {
      const avatarUrl = `https://robohash.org/${encodeURIComponent(email)}.png?size=200x200&set=set1`;
      setAvatar(avatarUrl);
     }
    }, [email]);



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (input) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordPattern.test(input)) {
      setPasswordError(
        'Password must be at least 6 characters long and include at least one letter, one number, and one special character (!@#$%^&*).'
      );
      return false;
    }
    setPasswordError('');
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register({ userName, email, avatar, password }).unwrap();
      navigate(`/otp-reg/${email}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="">
        <div className="row g-5 justify-content-center">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="h-100 d-flex align-items-center py-5 px-2 px-md-5" style={backgroundStyle}>
              <form onSubmit={submitHandler}>
                <h2 className="mb-4 text-center">Registration</h2>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Enter your UserName (Required)"
                      style={{ height: '55px' }}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>


          
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control border-0"
                      placeholder="Enter your email (Required)"
                      style={{ height: '55px' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>



                  <div className="col-12">
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-0"
                        placeholder="Password (Required)"
                        style={{ height: '55px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                        {showPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                      </span>
                    </div>
                    {passwordError && <p className="text-danger mt-2">{passwordError}</p>}
                  </div>

                  <div className="col-12">
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control border-0"
                        placeholder="Confirm Password (Required)"
                        style={{ height: '55px' }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <span className="input-group-text" onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
                        {showConfirmPassword ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-danger w-100 py-3" type="submit" disabled={isLoading || loading}>
                      Register
                    </button>
                    {loading && <Loader />}
                  </div>
                  <div className="col-12">
                    <p className="mt-3">
                      Already A Member? <Link to="/login">Sign In</Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp d-none d-md-block" data-wow-delay="0.5s">
            <div className="d-flex align-items-center justify-content-center h-100">
              <img
                src="/images/registration.jpg"
                alt="Registration"
                className="img-fluid"
                style={{ maxWidth: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
