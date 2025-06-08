
import { useState, useEffect, memo } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminHome from './components/AdminHome';
import AddUser from './components/AddUser';
import {Toaster} from 'react-hot-toast'

import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { axiosInstance } from './redux/axiosInterceptor';
import { setUser } from './redux/AuthSlice';

function ProtectedRoute({ ifLogged, notLogged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = Cookies.get('authToken');
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (token) {
        try {
          const { data } = await axiosInstance.get('/user/authenticated');
          if (data.userData) {
            dispatch(setUser(data.userData));
            setIsAuthenticated(data.status);
          } else {
            setIsAuthenticated(false);
            Cookies.remove('authToken');
          }
        } catch (error) {
          console.log(error.message);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [token, dispatch]);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? ifLogged : notLogged;
}

function AdminProtectedRoute({ ifAdminLogged, notAdminLogged }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
  const token = Cookies.get('authToken');

  useEffect(() => {
    const checkAdminAuthentication = async () => {
      if (token) {
        try {
          const { data } = await axiosInstance.get('/admin/authenticated');
          setIsAdminAuthenticated(data.status);
        } catch (error) {
          console.log(error.message);
          setIsAdminAuthenticated(false);
        }
      } else {
        setIsAdminAuthenticated(false);
      }
    };

    checkAdminAuthentication();
  }, [token]);

  if (isAdminAuthenticated === null) return <div>Loading...</div>;

  return isAdminAuthenticated ? ifAdminLogged : notAdminLogged;
}

function App() {
  return (
    <Router>
       <Toaster position="top-center" />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={
          <ProtectedRoute ifLogged={<Navigate to="/home" />} notLogged={<Signup />} />
        } />
        <Route path="/login" element={
          <ProtectedRoute ifLogged={<Navigate to="/home" />} notLogged={<Login />} />
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={
          <ProtectedRoute ifLogged={<Home />} notLogged={<Navigate to="/login" />} />
        } />

        {/* Admin Routes */}
        <Route path="/admin-login" element={
          <AdminProtectedRoute ifAdminLogged={<Navigate to="/admin-home" />} notAdminLogged={<AdminLogin />} />
        } />
        <Route path="/admin-home" element={
          <AdminProtectedRoute ifAdminLogged={<AdminHome />} notAdminLogged={<Navigate to="/admin-login" />} />
        } />
        <Route path="/add-user" element={
          <AdminProtectedRoute ifAdminLogged={<AddUser />} notAdminLogged={<Navigate to="/admin-login" />} />
        } />
      </Routes>
    </Router>
  );
}

export default memo(App);
