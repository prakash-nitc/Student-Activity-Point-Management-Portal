import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#0d1b2a] via-[#102a43] to-[#1b3a57]">
      {/* Background aurora and blobs */}
      <div className="aurora-bg opacity-70" />

      {/* Left: Hero with animated orbits */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        {/* Soft color blobs */}
        <div className="absolute -top-28 -left-20 h-72 w-72 bg-indigo-500/20 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-20 h-80 w-80 bg-sky-400/20 blur-3xl animate-blob" />

        <div className="relative z-10 max-w-xl p-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md fade-in-up">
            NITC Student Activity Point
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300">
              Management Portal
            </span>
          </h1>
          <p className="mt-5 text-indigo-100/90 text-lg fade-in-up" style={{animationDelay:'120ms'}}>
            Turning participation into progress. Submit activities, track approvals,
            and grow your portfolio.
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-indigo-100/90 fade-in-up" style={{animationDelay:'180ms'}}>
            <li className="flex items-center space-x-2"><span className="h-2 w-2 rounded-full bg-indigo-300"/> <span>Fast approvals</span></li>
            <li className="flex items-center space-x-2"><span className="h-2 w-2 rounded-full bg-fuchsia-300"/> <span>Secure uploads</span></li>
            <li className="flex items-center space-x-2"><span className="h-2 w-2 rounded-full bg-sky-300"/> <span>Live totals</span></li>
            <li className="flex items-center space-x-2"><span className="h-2 w-2 rounded-full bg-emerald-300"/> <span>Mobile friendly</span></li>
          </ul>

          {/* Animated orbit visuals */}
          <div className="mt-10 relative h-64 w-full">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 glow-ring animate-float-slow" />
            <div className="absolute left-6 top-3 h-20 w-20 rounded-full bg-white/10 border border-white/30 backdrop-blur glow-ring animate-float-reverse" />
            <div className="absolute right-10 bottom-6 h-24 w-24 rounded-full bg-white/10 border border-white/30 backdrop-blur glow-ring animate-float-x" />
          </div>
        </div>
      </div>

      {/* Right: Auth Card */}
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
              <div className="mb-4 rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2 border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="you@college.edu"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3 3l18 18-1.5 1.5L16.8 18.8A10.43 10.43 0 0112 20C6.5 20 2 15 2 12s4.5-8 10-8c2 0 3.8.6 5.3 1.6l3.2-3.2L21 2 3 20 1.5 18.5 3 17l.9-.9L3 15.3 4.3 14l1-1L3 10.7 4.3 9.4l1-1L3 6.7 4.3 5.4l1-1L3 3z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5C7 5 2.7 8.1 1 12c1.7 3.9 6 7 11 7s9.3-3.1 11-7c-1.7-3.9-6-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-white font-semibold shadow-sm transition-colors ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <span>Don’t have an account? </span>
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create one</Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-300">
            By signing in you agree to the college’s acceptable use policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
