import React,{useState} from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import { useResetPasswordMutation } from '../slices/usersApiSlice'




const backgroundStyle = {
    background: "#E7E8D8",
    borderRadius: "16px",
    boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)"
}


const Changepasswordscreen = () => {
  
    const { email } = useParams();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/login';
  
  
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const passwordInputType = showPassword ? 'text' : 'password';
  
  
    const validatePassword = (input) => {//password pattern
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
      if (!passwordPattern.test(input)) {
        setPasswordError(
        
        );
        return false;
      }
      setPasswordError('');
      return true;
    };
  
    const handleResetPassword = async (e) => {
      e.preventDefault();
      if (!validatePassword(password)) {
        toast.error('Password must be at least 6 characters long and include at least one letter, one number, and one special character (!@#$%^&*).');
        return;
      } 
      else if (password !== confirmPassword) {//password and confirm password must be same
          toast.error('Passwords do not match');
          return;
        }
      else{ 
          try {
          setLoading(true);
          await resetPassword({ email,password }).unwrap();
          toast.success('Your password is reset successfully');
          navigate(redirect);
          } catch (err) {
          toast.error(err?.data?.error || err.error, { autoClose: 5000 });
         } finally {
         setLoading(false);
        }
      }
    };
  
    
  return (
    <div className="container-xxl py-5">
    <div className="">
      <div className="row g-5">
        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
        <div className="h-100 d-flex align-items-center py-5 px-2 px-md-5" style={backgroundStyle}>
            <form onSubmit={handleResetPassword}>
              <h2 className="mb-4 text-center">Reset Your Password</h2>
              <div className="row g-3">
                <div className="col-12">
                  <br /> {/* Line break here */}
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <input
                      type={passwordInputType}
                      className="form-control border-0"
                      placeholder="Enter A Password(Required)"
                      style={{ height: '55px' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text" onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <i className="bi bi-eye"></i>
                      ) : (
                        <i className="bi bi-eye-slash"></i>
                      )}
                    </span>
                  </div>
                </div>


                <div className="col-12">
                  <div className="input-group">
                    <input
                      type={passwordInputType}
                      className="form-control border-0"
                      placeholder="Confirm Your Password(Required)"
                      style={{ height: '55px' }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-text" onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <i className="bi bi-eye"></i>
                      ) : (
                        <i className="bi bi-eye-slash"></i>
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn btn-danger w-100 py-3" type="submit" disabled={isLoading || loading}>
                    Reset Password
                  </button>
                  {loading && <Loader />}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-6 wow fadeInUp d-none d-md-block" data-wow-delay="0.5s">
          <div className="d-flex align-items-center justify-content-center h-100">
            <img
              src="/images/forget-password.png"
              alt="Reset Password Image"
              className="img-fluid"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Changepasswordscreen;