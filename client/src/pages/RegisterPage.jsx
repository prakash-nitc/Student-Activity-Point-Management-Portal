import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

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

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const emailLower = email.toLowerCase();
  const isNITCDomain = emailLower.endsWith('@nitc.ac.in');
  const isStudentEmail = /[._-][bm]\d/.test(emailLower.split('@')[0] || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isNITCDomain) {
      setError('Registration is only allowed with @nitc.ac.in emails.');
      return;
    }
    if (isStudentEmail && role !== 'student') {
      setError('Student emails can only register as Student.');
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

  // simple parallax for hero visuals
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#0d1b2a] via-[#102a43] to-[#1b3a57]">
      {/* background aurora */}
      <div className="aurora-bg opacity-70" />

      {/* Left: Register Card */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/60 p-8 fade-in-up">
            <div className="mb-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 9h10v2H7V9zm0 4h10v2H7v-2z"/></svg>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-sm text-gray-500">Join the portal</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2 border border-rose-200">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <FormInput id="email" label="Email (@nitc.ac.in)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className={`text-xs ${isNITCDomain ? 'text-emerald-600' : 'text-gray-500'} mt-1`}>
                {isStudentEmail ? 'Detected student email pattern (b/m + roll). Role will be Student.' : 'Enter your official @nitc.ac.in email.'}
              </p>
              <FormInput id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
                <select
                  id="role"
                  name="role"
                  className={`mt-1 block w-full rounded-lg border ${isStudentEmail ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                  value={isStudentEmail ? 'student' : role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isStudentEmail}
                >
                  <option value="student">Student</option>
                  <option value="fa">Faculty Advisor</option>
                  <option value="admin">Admin</option>
                </select>
                {isStudentEmail && (
                  <p className="text-xs text-gray-500 mt-1">Role is locked to Student based on email.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-white font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <span>Already have an account? </span>
              <Link to="/auth" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Animated collage with improved sizes */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden"
           onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
             const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
             setTilt({ x, y });
           }}
           onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
        <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 800 600" aria-hidden="true">
          <path className="doodle-line" d="M40 140 C160 80, 260 200, 380 140 S620 60, 760 140"/>
          <path className="doodle-line doodle-wiggle" style={{animationDelay:'400ms'}} d="M80 420 C200 360, 260 480, 380 420 S620 340, 720 420"/>
          <path className="doodle-line" style={{animationDelay:'800ms'}} d="M140 260 Q240 240 280 300 T440 300 T640 340"/>
        </svg>
        {/* animated blobs */}
        <div className="absolute -top-24 -left-24 h-72 w-72 bg-emerald-400/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 h-80 w-80 bg-fuchsia-400/20 blur-3xl animate-blob" />

        <div className="relative z-10 max-w-xl p-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md fade-in-up">
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300 animate-gradient">
              NITC Activity Points
            </span>
          </h1>
          <p className="mt-4 text-indigo-100/90 text-lg fade-in-up" style={{animationDelay:'120ms'}}>
            Showcase achievements and grow your portfolio.
          </p>

          <div className="mt-10 relative h-[28rem] w-full">
            {/* Larger hero images (no bubbles) */}
            <img src="/images/student2.png" alt="Teamwork" className="absolute left-1/2 top-1/2 rounded-full object-cover shadow-2xl glow-ring fade-in-up"
                 style={{ height: '20rem', width: '20rem', transform: `translate(-50%, -50%) translateX(${tilt.x * 12}px) translateY(${tilt.y * 12}px)`, animationDelay: '200ms' }} />
            <img src="/images/student1.png" alt="Workshop" className="absolute left-4 top-2 rounded-full object-cover shadow-xl glow-ring fade-in-up"
                 style={{ height: '11rem', width: '11rem', transform: `translateX(${tilt.x * -8}px) translateY(${tilt.y * -8}px)`, animationDelay: '500ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;