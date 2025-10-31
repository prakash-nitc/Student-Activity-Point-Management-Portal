import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    // Main container to center content on the gradient background
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* "Glassmorphism" Card */}
      <div className="w-full max-w-md p-8 sm:p-12 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl text-center">

        {/* You can add an SVG/PNG logo here */}
        
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          NITC Student Activity Portal
        </h1>
        <p className="mt-4 text-xl text-gray-800 font-medium">
          Point Management System
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            to="/auth"
            className="w-full sm:w-auto flex-1 justify-center py-3 px-8 border border-transparent rounded-md shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/auth?register=true"
            className="w-full sm:w-auto flex-1 justify-center py-3 px-8 border border-transparent rounded-md shadow-lg text-lg font-medium text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;