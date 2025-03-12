import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Homescreen from './screens/Homescreen';
import Registrationscreen from './screens/Registrationscreen.jsx';
import Loginscreen from './screens/Loginscreen.jsx';
import Verifyotpregscreen from './screens/Verifyotpregscreen.jsx';
import Profilescreen from './screens/Profilescreen.jsx';
import PrivateRoute from './components/privateRoute.jsx';
import Sendrecoveryemailscreen from './screens/Sendrecoveryemailscreen.jsx';
import PasswordRecoveryOtpScreen from './screens/PasswordRecoveryOtpScreen.jsx';
import Changepasswordscreen from './screens/Changepasswordscreen.jsx';
import Createquizscreen from './screens/Createquizscreen.jsx';
import ViewQuizDetailsScreen from './screens/ViewQuizDetailsscreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element={<App />}>
      <Route index={true} path="/" element={<Homescreen/>}/>
      <Route path="/register" element={<Registrationscreen/>}/> 
      <Route path="/login" element={<Loginscreen/>}/>
      <Route path="/otp-reg/:email" element={<Verifyotpregscreen/>}/>
      <Route path="/profile" element={<Profilescreen/>}/>
      <Route path="/send-email" element={<Sendrecoveryemailscreen/>}/>
      <Route path="/password-recovery-otp/:email" element={<PasswordRecoveryOtpScreen/>}/>
      <Route path="/change-password/:email" element={<Changepasswordscreen/>}/>

      <Route path='' element={<PrivateRoute/>}>
          <Route path='/create-quiz' element={<Createquizscreen/>}/>
          <Route path='/view-quiz/:id' element={<ViewQuizDetailsScreen/>}/>
      </Route>


    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
