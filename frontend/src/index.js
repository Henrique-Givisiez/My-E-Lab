import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signup from './pages/signup'
import Login from './pages/login'
import Loans from './pages/loans'
import Profile from './pages/profile'
import Users from './pages/users'
import Register from './pages/register';
import Search from './pages/search';
import ItemDetails from './components/item_details';
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
      <Route path='/profile' element={<Profile />} />
      <Route path='/users' element={<Users />} />
      <Route path='/register' element={<Register />} />
      <Route path='/search' element={<Search />} />
      <Route path="/detalhes/:type/:id" element={<ItemDetails />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
