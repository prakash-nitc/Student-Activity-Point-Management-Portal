// import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import AuthPage from './pages/AuthPage';
// import DashboardPage from './pages/DashboardPage';
// import LandingPage from './pages/LandingPage';
// // Removed ForgotPasswordPage and ResetPasswordPage imports
// import './index.css';

// const PrivateRoute = ({ children }) => {
//   const userInfo = localStorage.getItem('userInfo');
//   return userInfo ? children : <Navigate to="/auth" />;
// };

// const PublicRoute = ({ children }) => {
//   const userInfo = localStorage.getItem('userInfo');
//   return userInfo ? <Navigate to="/dashboard" /> : children;
// };


// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
//         <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
        
//         {/* Removed routes for forgot-password and reset-password */}

//         {/* Redirect old routes to the main auth page */}
//         <Route path="/login" element={<Navigate to="/auth" />} />
//         <Route path="/register" element={<Navigate to="/auth" />} />

//         {/* Private Routes - Require login */}
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <DashboardPage />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import LandingPage from './pages/LandingPage'; // <-- This line is removed
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
        <Route path="/" element={<PublicRoute><AuthPage /></PublicRoute>} /> {/* <-- This is now the root page */}
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

export default App;