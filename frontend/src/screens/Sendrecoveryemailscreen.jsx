import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useForgetPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const backgroundStyle = {
  background: "#E7E8D8",
  borderRadius: "16px",
  boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)"
}

function Sendrecoveryemail() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [forgotPassword, { isLoading  }] = useForgetPasswordMutation(); // from donorsApislice


    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
          setLoading(true); // Show the loader
          await forgotPassword(email).unwrap();
          navigate(`/password-recovery-otp/${email}`);
          toast.success('Password recovery email sent successfully. Check your email.');
        } catch (err) {
          if (err?.data?.error === 'User not found') {
            toast.error('No account found with this email.', { autoClose: 5000 });
          } else {
            toast.error(err?.data?.error || err.error, { autoClose: 5000 });
          }
        } finally {
            setLoading(false); // Hide the loader
        }
      };

  return (
    <div className="container-xxl py-5">
    <div className="">
      <div className="row g-5 justify-content-center">
        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
        <div className="h-100 d-flex align-items-center py-5 px-2 px-md-5" style={backgroundStyle}>
            <form onSubmit={handleForgotPassword}>
              <h2 className="mb-4 text-center">Password Recovery</h2>
              <div className="row g-3">
                <div className="col-12">
                  <input
                    type="email"
                    className="form-control border-0"
                    placeholder="Confirm Your Email"
                    style={{ height: '55px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  required/>
                </div>
                <div className="col-12">
                  <br /> {/* Line break here */}
                </div>
                <div className="col-12">
                  <button className="btn btn-danger w-100 py-3" type="submit" disabled={isLoading || loading}>
                      Send OTP
                  </button>
                  {loading && <Loader />}
                </div>
                <div className="col-12">
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Sendrecoveryemail