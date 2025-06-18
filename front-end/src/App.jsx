
import { useState, useEffect, memo } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminHome from './components/AdminHome';
import AddUser from './components/AddUser';
import {Toaster} from 'react-hot-toast'
import {logout} from './redux/AuthSlice'
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { axiosInstance } from './redux/axiosInterceptor';
import { setUser } from './redux/AuthSlice';




function ProtectedRoute({ ifLogged, notLogged }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();
  

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      dispatch(logout());
      setIsAuthenticated(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        const { data } = await axiosInstance.get('/user/authenticated');

        if (data.role === 'user') {
          dispatch(setUser(data.userData));
          setIsAuthenticated(true);
        } else {
          Cookies.remove('authToken');
          dispatch(logout());
          setIsAuthenticated(false);
          // window.location.replace('/login'); // force stop
        }
      } catch (error) {
        Cookies.remove('authToken');
        dispatch(logout());
        setIsAuthenticated(false);
        // window.location.replace('/login');
      }
    };

    checkAuthentication();
  }, [dispatch]);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? ifLogged : notLogged;
}






function AdminProtectedRoute({ ifAdminLogged, notAdminLogged }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      setIsAdminAuthenticated(false);
      return;
    }

    const checkAdminAuthentication = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/authenticated');

        // ✅ If role is admin, allow access
        if (data.role === 'admin') {
          setIsAdminAuthenticated(true);
        } else {
          // ❌ If role is NOT admin, remove token & redirect
          Cookies.remove('authToken');
              dispatch(logout());
          setIsAdminAuthenticated(false);
          navigate("/admin-login", { replace: true })
          
         
        }

      } catch (error) {
        console.error('Admin auth failed:', error.message);
        Cookies.remove('authToken');
        dispatch(logout());
        setIsAdminAuthenticated(false);
         navigate("/admin-login", { replace: true })
      }
    };

    checkAdminAuthentication();
  }, [dispatch, navigate]);

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
