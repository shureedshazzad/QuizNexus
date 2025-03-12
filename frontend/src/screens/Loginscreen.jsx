import React,{useState, useEffect} from "react"
import { Link, useLocation , useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Loader from '../components/Loader';
import { useLoginMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice";
import {toast} from 'react-toastify';


const backgroundStyle = {
    background: "#E7E8D8",
    borderRadius: "16px",
    boxShadow: "0 30px 30px -25px rgba(65, 51, 183, 0.25)"
}

const Loginscreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [login, { isLoading }] = useLoginMutation();
  
    const { userInfo } = useSelector((state) => state.auth);
  
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
  
    useEffect(() => {
      if (userInfo) {
        navigate(redirect);
      }
    }, [userInfo, redirect, navigate]);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const passwordInputType = showPassword ? 'text' : 'password';
  
    const submitHandler = async (e) => {
      e.preventDefault();
      try {
        setLoading(true); // Show the loader
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success('Login Successful'); 
      } catch (err) {
        toast.error(err?.data?.message || err.error, { autoClose: 500 }); // Increase the duration to 5000 milliseconds (5 seconds)
      } finally {
        setLoading(false); // Hide the loader
      }
    };
  
   

  return (
    <div className="container-xxl py-5">
    <div className="">
      <div className="row g-5">
        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
          <div className="h-100 d-flex align-items-center py-5 px-2 px-md-5" style={backgroundStyle}>
            <form onSubmit={submitHandler}>
              <h2 className="mb-4 text-center">Sign In</h2>
              <div className="row g-3">
                <div className="col-12">
                  <input
                    type="email"
                    className="form-control border-0"
                    placeholder="Enter Your Email"
                    style={{ height: '55px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  required/>
                </div>

                <div className="col-12">
                  <div className="input-group">
                    <input
                      type={passwordInputType}
                      className="form-control border-0"
                      placeholder="Enter Your Password"
                      style={{ height: '55px' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    required/>
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
                    Sign In
                  </button>
                  {loading && <Loader />}
                </div>
                <div className="col-12">
                  <p className="mt-3">
                    Forget Password? <Link to="/send-email">Click here to recover password</Link>
                  </p>
                  <p className="mt-3">
                    Not a member? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Be a member</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-6 wow fadeInUp d-none d-md-block" data-wow-delay="0.5s">
          <div className="d-flex align-items-center justify-content-center h-100">
            <img
              src="/images/login.jpg"
              alt="Login Image"
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

export default Loginscreen
