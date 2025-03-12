import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useVerifyOTPMutation } from '../slices/usersApiSlice';

const backgroundStyle = {
  background: "#E7E8D8",
  borderRadius: "16px",
  boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)"
};

function PasswordRecoveryOtpScreen() {
  const { email } = useParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [verifyOTPReg, { isLoading }] = useVerifyOTPMutation();


  const [expirationTime, setExpirationTime] = useState(() => {
    const storedExpirationTime = localStorage.getItem('otpExpirationTime');
    return storedExpirationTime ? new Date(storedExpirationTime) : new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiration
  });

  const [countdown, setCountdown] = useState(() => {
    const storedExpirationTime = localStorage.getItem('otpExpirationTime');
    return storedExpirationTime ? Math.max(0, Math.floor((new Date(storedExpirationTime) - Date.now()) / 1000)) : 2 * 60;
  });

  useEffect(() => {
    const storedExpirationTime = localStorage.getItem('otpExpirationTime');
    if (!storedExpirationTime) {
      const newExpirationTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiration
      setExpirationTime(newExpirationTime);
      localStorage.setItem('otpExpirationTime', newExpirationTime);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const timeLeft = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        localStorage.removeItem('otpExpirationTime'); // Clear expiration time on expiration
         await verifyOTPReg({email,otp: otp.join(''),count: 0});
        toast.error('OTP expired');
        clearInterval(interval);
        navigate('/login'); // Redirect to login page
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await verifyOTPReg({ email, otp: otp.join(''),count: 5 }).unwrap();
      toast.success('OTP verification successful.');
      localStorage.removeItem('otpExpirationTime'); // Clear expiration time on successful verification
      navigate(`/change-password/${email}`);
    } catch (err) {
      toast.error(err?.data?.error || err.error, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically focus on the next input
      if (value !== '' && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="container-xxl py-5 d-flex align-items-center justify-content-center">
      <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
        <div className="h-100 d-flex align-items-center p-5" style={backgroundStyle}>
          <form onSubmit={handleVerifyOTP}>
            <h2 className="mb-4">Verify OTP</h2>
            <div className="row g-3">
              {otp.map((digit, index) => (
                <div className="col-3" key={index}>
                  <input
                    type="text"
                    id={`otp-input-${index}`}
                    className="form-control border-0 text-center"
                    placeholder="0"
                    style={{ height: '55px' }}
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </div>
              ))}
              <div className="col-12">
                <small className="text-muted">OTP will expire in {Math.floor(countdown / 60)}:{countdown % 60} minutes</small>
              </div>
              <div className="col-12">
                <br />
              </div>
              <div className="col-12">
                <button className="btn btn-danger w-100 py-3" type="submit" disabled={isLoading || loading}>
                  Verify OTP
                </button>
                {loading && <Loader />}
              </div>
              <div className="col-12"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecoveryOtpScreen;
