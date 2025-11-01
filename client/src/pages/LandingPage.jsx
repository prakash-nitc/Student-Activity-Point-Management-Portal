import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    // Main container to center the card on the screen
    <div className="min-h-screen flex items-center justify-center p-4">

      {/* The main card, styled to match the image */}
      <div className="w-full max-w-lg p-10 sm:p-14 bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl text-center backdrop-blur-sm">

        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          NITC Student Activity Portal
        </h1>

        <p className="mt-4 text-xl text-gray-300">
          Point Management System
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            to="/auth" // Links to the login/register page
            className="w-full sm:w-auto flex-1 justify-center py-3 px-8 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/auth?register=true" // Links to the register form
            className="w-full sm:w-auto flex-1 justify-center py-3 px-8 border border-transparent rounded-lg shadow-lg text-lg font-medium text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;