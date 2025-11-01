// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { register } from '../services/api'; // <-- THIS LINE IS FIXED

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
//     </div>
//   </div>
// );

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('student');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!email.endsWith('@nitc.ac.in')) {
//       setError('Registration is only allowed with @nitc.ac.in emails.');
//       return;
//     }
//     try {
//       await register({ name, email, password, role });
//       alert('Registration successful! Please log in.');
//       navigate('/auth');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Left Column (Register Form) */}
//       <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-blue-900 text-white">
//         <div className="mx-auto w-full max-w-sm lg:w-96">
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
//             <p className="mt-2 text-sm text-gray-300">Join the portal</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && <p className="text-red-400 text-sm">{error}</p>}
//             <FormInput
//               id="name"
//               label="Full Name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <FormInput
//               id="email"
//               label="Email (@nitc.ac.in)"
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
//              <div>
//               <label htmlFor="role" className="text-sm font-medium text-gray-400">
//                 Register as
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 className="mt-1 block w-full bg-blue-900 border-0 border-b-2 border-gray-500 text-white focus:border-white focus:ring-0"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//               >
//                 <option value="student">Student</option>
//                 <option value="fa">Faculty Advisor</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
//             >
//               Sign Up
//             </button>
//           </form>

//           <div className="mt-8 flex items-center justify-between">
//             <p className="text-sm text-gray-300">Already have an account?</p>
//             <Link
//               to="/auth"
//               className="font-medium text-white border border-white rounded-md px-4 py-2 text-sm hover:bg-white hover:text-blue-900 transition-colors"
//             >
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Right Column (Welcome) */}
// <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-800 p-8">
//   <div className="text-white text-left max-w-md">
//     <h1 className="text-5xl font-bold">Welcome to NITC Student Portal</h1>
//     <p className="mt-4 text-xl text-gray-300">NITC is People</p>
//     <div className="mt-10">
//       {/* Images of students */}
//       <div className="flex -space-x-8">
//         <img 
//           src="/student1.png"  {/* <-- CHANGED HERE */}
//           alt="Student 1" 
//           className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-blue-800" 
//         />
//         <img 
//           src="/student2.png"  {/* <-- CHANGED HERE */}
//           alt="Student 2" 
//           className="w-48 h-48 rounded-full object-cover shadow-lg translate-y-8 border-4 border-blue-800" 
//         />
//       </div>
//     </div>
//   </div>
// </div>
//   );
// };

// export default RegisterPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

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
    </div>
  </div>
);

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.endsWith('@nitc.ac.in')) {
      setError('Registration is only allowed with @nitc.ac.in emails.');
      return;
    }
    try {
      await register({ name, email, password, role });
      alert('Registration successful! Please log in.');
      navigate('/auth');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column (Register Form) */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-blue-900 text-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
            <p className="mt-2 text-sm text-gray-300">Join the portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <FormInput
              id="name"
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormInput
              id="email"
              label="Email (@nitc.ac.in)"
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
             <div>
              <label htmlFor="role" className="text-sm font-medium text-gray-400">
                Register as
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full bg-blue-900 border-0 border-b-2 border-gray-500 text-white focus:border-white focus:ring-0"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="fa">Faculty Advisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-300">Already have an account?</p>
            <Link
              to="/auth"
              className="font-medium text-white border border-white rounded-md px-4 py-2 text-sm hover:bg-white hover:text-blue-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column (Welcome) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-800 p-8">
        <div className="text-white text-left max-w-md">
          <h1 className="text-5xl font-italic text-white font-bebas">NITC Student Activity Point Management Portal</h1>
          <p className="mt-4 text-xl text-gray-300">Turning Participation into Progress.</p>
          
          {/* --- THIS IS THE MODIFIED PART --- */}
          <div className="mt-10">
            <div className="flex -space-x-8">
              <img
                className="w-52 h-52 rounded-full object-cover shadow-lg border-4 border-blue-800"
                src="/images/student1.png"
                alt="Student 1"
              />
              <img
                className="w-53 h-53 rounded-full object-cover shadow-lg translate-y-8 border-4 border-blue-800"
                src="/images/student2.png"
                alt="Student 2"
              />
            </div>
          </div>
          {/* ---------------------------------- */}
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;