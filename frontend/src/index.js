import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signup from './pages/signup'
import Login from './pages/login'
import Loans from './pages/loans'
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Signup /> } />
      <Route path="/login" element={<Login /> } />
      <Route path='/loans' element={<Loans />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
