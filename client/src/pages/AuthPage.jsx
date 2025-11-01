// // import { useEffect, useState } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import Login from '../components/auth/Login';
// // import Register from '../components/auth/Register';

// // function useQuery() {
// //   return new URLSearchParams(useLocation().search);
// // }

// // const AuthPage = () => {
// //   const query = useQuery();
// //   const [isLoginView, setIsLoginView] = useState(query.get('register') !== 'true');

// //   const handleRegisterSuccess = () => {
// //     alert('Registration successful! Please sign in.');
// //     setIsLoginView(true);
// //   };

// //   const location = useLocation();
// //   useEffect(() => {
// //     setIsLoginView(query.get('register') !== 'true');
// //   }, [location.search, query]);


// //   return (
// //     // Use the same centering and background as the landing page
// //     <div className="min-h-screen flex items-center justify-center p-4">
// //       {/* This is now a solid white card, which looks good on the gradient */}
// //       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
// //         <div className="text-center mb-6">
// //           <h2 className="text-3xl font-extrabold text-gray-900">
// //             {isLoginView ? 'Welcome Back' : 'Create Your Account'}
// //           </h2>
// //           <p className="mt-2 text-sm text-gray-600">
// //             {isLoginView ? 'Sign in to access your portal' : 'Join us to manage your activities'}
// //           </p>
// //         </div>

// //         {isLoginView ? (
// //           <Login />
// //         ) : (
// //           <Register onRegisterSuccess={handleRegisterSuccess} />
// //         )}

// //         <div className="mt-6 text-center text-sm">
// //           <button
// //             onClick={() => setIsLoginView(!isLoginView)}
// //             className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //           >
// //             {isLoginView ? "Don't have an account? Register" : 'Already have an account? Sign in'}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthPage;
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { login } from '../services/api';

// // Helper component for the form inputs
// const FormInput = ({ id, label, type, value, onChange }) => (
//   <div>
//     <label htmlFor={id} className="text-sm font-medium text-gray-400">
//       {label}
//     </label>
//     <div className="mt-1 relative">
//       <input
//         id={id}
//         name={id}
//         type={type}
//         required
//         value={value}
//         onChange={onChange}
//         className="block w-full bg-transparent border-0 border-b-2 border-gray-500 text-white shadow-sm focus:border-white focus:ring-0 sm:text-sm"
//       />
//       {type === 'password' && (
//         <span className="absolute inset-y-0 right-0 flex items-center pr-3">
//           {/* Eye icon - you can add an icon library later */}
//         </span>
//       )}
//     </div>
//   </div>
// );

// const AuthPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const { data } = await login({ email, password });
//       localStorage.setItem('userInfo', JSON.stringify(data));
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left Column (Login Form) */}
//       <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-blue-900 text-white">
//         <div className="mx-auto w-full max-w-sm lg:w-96">
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-white">Login</h2>
//             <p className="mt-2 text-sm text-gray-300">User Authentication</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && <p className="text-red-400 text-sm">{error}</p>}
//             <FormInput
//               id="email"
//               label="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <FormInput
//               id="password"
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <div className="text-sm">
//               <Link to="/forgot-password" className="font-medium text-gray-300 hover:text-white">
//                 Forgot Password?
//               </Link>
//             </div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
//             >
//               Login
//             </button>
//           </form>

//           <div className="mt-8 flex items-center justify-between">
//             <p className="text-sm text-gray-300">Create account?</p>
//             <Link
//               to="/register"
//               className="font-medium text-white border border-white rounded-md px-4 py-2 text-sm hover:bg-white hover:text-blue-900 transition-colors"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Right Column (Welcome) */}
//       <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-800 p-8">
//         <div className="text-white text-left max-w-md">
//           <nav className="flex justify-end text-sm font-medium space-x-6 mb-16">
//             <a href="#" className="hover:underline">Home</a>
//             <a href="#" className="hover:underline">Students</a>
//           </nav>
//           <h1 className="text-5xl font-bold">Welcome to NIIT Student Portal</h1>
//           <p className="mt-4 text-xl text-gray-300">NIIT is People</p>
//           <div className="mt-10">
//             {/* Placeholder for images */}
//             <div className="flex -space-x-8">
//               <span className="w-48 h-48 rounded-full bg-gray-500 flex items-center justify-center text-gray-800 shadow-lg">Student 1</span>
//               <span className="w-48 h-48 rounded-full bg-gray-400 flex items-center justify-center text-gray-800 shadow-lg translate-y-8">Student 2</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api'; // <-- THIS LINE IS FIXED

// Helper component for the form inputs
const FormInput = ({ id, label, type, value, onChange }) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-gray-400">
      {label}
    </label>
    <div className="mt-1 relative">
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="block w-full bg-transparent border-0 border-b-2 border-gray-500 text-white shadow-sm focus:border-white focus:ring-0 sm:text-sm"
      />
      {type === 'password' && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {/* Eye icon - you can add an icon library later */}
        </span>
      )}
    </div>
  </div>
);

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column (Login Form) */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-blue-900 text-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white">Login</h2>
            <p className="mt-2 text-sm text-gray-300">User Authentication</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Login
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <Link
              to="/register"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column (Welcome) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-800 p-8">
        <div className="text-white text-left max-w-md">
          <h1 className="text-5xl font-bold">Welcome to NITC Student Portal</h1>
          <p className="mt-4 text-xl text-gray-300">NITC is People</p>
          <div className="mt-10">
            {/* Placeholder for images */}
            <div className="flex -space-x-8">
              <div className="w-48 h-48 rounded-full bg-gray-500 flex items-center justify-center text-gray-800 shadow-lg border-4 border-blue-800">Student 1</div>
              <div className="w-48 h-48 rounded-full bg-gray-400 flex items-center justify-center text-gray-800 shadow-lg translate-y-8 border-4 border-blue-800">Student 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;