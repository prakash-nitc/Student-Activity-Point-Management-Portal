import { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleRegisterSuccess = () => {
    alert('Registration successful! Please sign in.');
    setIsLoginView(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLoginView ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLoginView ? 'Sign in to access your portal' : 'Join us to manage your activities'}
          </p>
        </div>

        {isLoginView ? (
          <Login />
        ) : (
          <Register onRegisterSuccess={handleRegisterSuccess} />
        )}

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoginView ? "Don't have an account? Register" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;