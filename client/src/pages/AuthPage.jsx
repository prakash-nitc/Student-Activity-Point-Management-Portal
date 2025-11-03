// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { login } from '../services/api';

// const FormInput = ({ id, label, type, value, onChange }) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
//     <input
//       id={id}
//       name={id}
//       type={type}
//       required
//       value={value}
//       onChange={onChange}
//       className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//     />
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
//     <div className="relative min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#0d1b2a] via-[#102a43] to-[#1b3a57]">
//       {/* animated aurora background */}
//       <div className="aurora-bg opacity-70" />

//       {/* Left: Auth Card */}
//       <div className="flex items-center justify-center p-6 sm:p-10">
//         <div className="w-full max-w-md">
//           <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/60 p-8 fade-in-up">
//             <div className="mb-6 text-center">
//               <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 9h10v2H7V9zm0 4h7v2H7v-2z"/></svg>
//               </div>
//               <h2 className="mt-3 text-2xl font-bold text-gray-900">Welcome Back</h2>
//               <p className="text-sm text-gray-500">Sign in to continue</p>
//             </div>

//             {error && (
//               <div className="mb-4 rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2 border border-rose-200">{error}</div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <FormInput id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//               <FormInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//               <button
//                 type="submit"
//                 className="w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-white font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Sign In
//               </button>
//             </form>

//             <div className="mt-6 text-center text-sm text-gray-600">
//               <span>Don’t have an account? </span>
//               <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create one</Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right: Hero visuals with animated orbits and images */}
//       <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
//         {/* floating color blobs */}
//         <div className="absolute -top-28 -left-20 h-72 w-72 bg-indigo-500/20 blur-3xl animate-blob" />
//         <div className="absolute top-1/2 -translate-y-1/2 -right-20 h-80 w-80 bg-sky-400/20 blur-3xl animate-blob" />

//         <div className="relative z-10 max-w-xl p-10 text-white">
//           <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md fade-in-up">
//             NITC Student Activity Point
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300">
//               Management Portal
//             </span>
//           </h1>
//           <p className="mt-4 text-indigo-100/90 text-lg fade-in-up" style={{animationDelay:'120ms'}}>
//             Turning participation into progress. Submit activities, track approvals,
//             and grow your portfolio.
//           </p>

//         <div className="mt-10 relative h-64 w-full">
//           {/* Orbiting photos */}
//           <img src="/images/student2.png" alt="Students collaborating" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full object-cover shadow-xl glow-ring animate-float-slow" />
//           <img src="/images/student1.png" alt="Campus life" className="absolute left-6 top-3 h-24 w-24 rounded-full object-cover shadow-lg glow-ring animate-float-reverse" />
//           <div className="absolute right-10 bottom-6 h-24 w-24 rounded-full bg-white/10 border border-white/30 backdrop-blur glow-ring animate-float-x" />
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const FormInput = ({ id, label, type, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      required
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
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
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#0d1b2a] via-[#102a43] to-[#1b3a57]">
      {/* animated aurora background */}
      <div className="aurora-bg opacity-70" />

      {/* Left: Auth Card */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/60 p-8 fade-in-up">
            <div className="mb-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 9h10v2H7V9zm0 4h7v2H7v-2z"/></svg>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-500">Sign in to continue</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2 border border-rose-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FormInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-white font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <span>Don’t have an account? </span>
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create one</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Hero visuals with doodles and larger images */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 800 600" aria-hidden="true">
          <path className="doodle-line" d="M40 120 C160 60, 260 180, 380 120 S620 40, 760 120"/>
          <path className="doodle-line doodle-wiggle" style={{animationDelay:'400ms'}} d="M60 360 C200 300, 260 420, 380 360 S620 280, 740 360"/>
          <path className="doodle-line" style={{animationDelay:'800ms'}} d="M120 220 Q220 200 260 260 T420 260 T620 300"/>
        </svg>

        <div className="relative z-10 max-w-xl p-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md fade-in-up">
            NITC Student Activity Point
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300 animate-gradient">
              Management Portal
            </span>
          </h1>
          <p className="mt-4 text-indigo-100/90 text-lg fade-in-up" style={{animationDelay:'120ms'}}>
            Turning participation into progress. Submit activities, track approvals,
            and grow your portfolio.
          </p>

          <div className="mt-10 relative h-96 w-full">
            {/* Larger photos with soft motion (no bubbles) */}
            <img src="/images/student2.png" alt="Students collaborating" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full object-cover shadow-2xl glow-ring fade-in-up" style={{animationDelay:'200ms'}} />
            <img src="/images/student1.png" alt="Campus life" className="absolute left-2 top-6 h-44 w-44 rounded-full object-cover shadow-xl glow-ring fade-in-up" style={{animationDelay:'500ms'}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;