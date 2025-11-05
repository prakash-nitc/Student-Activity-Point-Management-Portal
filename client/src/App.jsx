import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Redirect old routes */}
        <Route path="/login" element={<Navigate to="/auth" />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

