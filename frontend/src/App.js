import React from 'react';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    <ToastContainer/>
    </>
  )
}

export default App
