import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

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

  // simple parallax for hero visuals
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    setTilt({ x, y });
  };

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#0d1b2a] via-[#102a43] to-[#1b3a57]">
      {/* Background aurora */}
      <div className="aurora-bg opacity-70" />

      {/* NIT Calicut logo top-left */}
      <div className="absolute left-4 top-4 z-30 hidden sm:flex items-center space-x-3">
        <img src="/images/nitc.png" alt="NIT Calicut logo" className="h-9 w-9 rounded bg-white p-1 shadow-md" />
        <span className="text-white/90 font-semibold tracking-wide">NITC</span>
      </div>

      {/* Left: Glass login card */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="bg-white/15 text-white backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 fade-in-up">
            <div className="mb-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md animate-float-x">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM7 9h10v2H7V9zm0 4h7v2H7v-2z"/></svg>
              </div>
              <h2 className="mt-3 text-2xl font-bold">Welcome Back</h2>
              <p className="text-sm text-white/80">Sign in to continue</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-500/15 text-rose-200 text-sm px-3 py-2 border border-rose-400/30">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="you@nitc.ac.in"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90">Password</label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-glow w-full inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-white font-semibold shadow-sm transition bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/80">
              <span>Don’t have an account? </span>
              <Link to="/register" className="font-semibold text-indigo-200 hover:text-white">Create one</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Hero visuals with animated orbits and doodles */}
      <div
        className="relative hidden lg:flex items-center justify-center overflow-hidden"
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        {/* floating color blobs */}
        <div className="absolute -top-28 -left-20 h-72 w-72 bg-indigo-500/20 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-20 h-80 w-80 bg-sky-400/20 blur-3xl animate-blob" />

        <div className="relative z-10 max-w-xl p-10 text-white">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md fade-in-up">
            NITC Student Activity Point
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300 animate-gradient">
              Management Portal
            </span>
          </h1>
          <p className="mt-4 text-indigo-100/90 text-lg fade-in-up" style={{ animationDelay: '120ms' }}>
            Turning participation into progress. Submit activities, track approvals,
            and grow your portfolio.
          </p>

          {/* Feature bullets */}
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-indigo-100/90 fade-in-up" style={{ animationDelay: '180ms' }}>
            <li className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-indigo-300" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7a3 3 0 013-3h2a3 3 0 013 3v10H7a3 3 0 01-3-3V7zm8 0a3 3 0 013-3h2a3 3 0 013 3v3a3 3 0 01-3 3h-5V7z"/></svg>
              <span>Students collaborating — Submit activities</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-fuchsia-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.5L12 14.8 7.2 17l.9-5.5L4.2 7.7l5.4-.8L12 2z"/></svg>
              <span>Trophy & certificates — Track approvals</span>
            </li>
            <li className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-emerald-300" viewBox="0 0 24 24" fill="currentColor"><path d="M5 19h14v2H5v-2zm2-4l3-3 2 2 5-5 1.5 1.5L12 17l-2-2-3 3z"/></svg>
              <span>Grow your portfolio — Insights & totals</span>
            </li>
          </ul>

          {/* Orbit visuals - circles pulled closer */}
          <div className="mt-10 relative h-72 w-full">
            <div
              className="absolute left-1/2 top-1/2 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 glow-ring animate-float-slow"
              style={{ height: '14rem', width: '14rem', transform: `translate(-50%, -50%) translateX(${tilt.x * 14}px) translateY(${tilt.y * 14}px)` }}
            />
            <div
              className="absolute left-1/2 top-1/2 rounded-full bg-white/10 border border-white/30 backdrop-blur glow-ring animate-float-reverse"
              style={{ height: '6.2rem', width: '6.2rem', transform: `translate(calc(-50% - 120px), calc(-50% - 90px)) translateX(${tilt.x * -6}px) translateY(${tilt.y * -6}px)` }}
            />
            <div
              className="absolute left-1/2 top-1/2 rounded-full bg-white/10 border border-white/30 backdrop-blur glow-ring animate-float-x"
              style={{ height: '7rem', width: '7rem', transform: `translate(calc(-50% + 130px), calc(-50% + 85px)) translateX(${tilt.x * 6}px) translateY(${tilt.y * 6}px)` }}
            />

            {/* twinkle particles */}
            <span className="twinkle" style={{ top: '10%', left: '12%', width: 3, height: 3, animationDelay: '0.4s' }} />
            <span className="twinkle" style={{ top: '18%', right: '15%', width: 4, height: 4, animationDelay: '1.2s' }} />
            <span className="twinkle" style={{ bottom: '14%', left: '22%', width: 3, height: 3, animationDelay: '2.0s' }} />
          </div>

          {/* Doodle lines */}
          <svg className="pointer-events-none absolute inset-0" viewBox="0 0 700 300" fill="none">
            <path className="doodle-line doodle-wiggle" d="M20 80 C 120 20, 220 140, 320 80 S 520 60, 680 120" />
            <path className="doodle-line" d="M60 200 C 180 180, 260 260, 420 220 S 600 220, 660 260" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
