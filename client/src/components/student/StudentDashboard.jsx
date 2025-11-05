import React, { useState, useEffect } from 'react';
import { getMyRequests, getUserProfile, resubmitRequest } from '../../services/api';
import RequestForm from './RequestForm';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);

  const fetchData = async () => {
    try {
      const requestsRes = await getMyRequests();
      const profileRes = await getUserProfile();
      setRequests(requestsRes.data);
      setProfile(profileRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Calculate Stats ---
  // Prefer server-aggregated totals only when available; otherwise sum approved requests.
  const hasProfileTotals = Array.isArray(profile?.pointsData) && profile.pointsData.length > 0;
  const totalFromProfile = hasProfileTotals
    ? profile.pointsData.reduce((acc, c) => acc + Number(c.points || 0), 0)
    : 0;

  const totalFromRequests = requests
    .filter(r => r.status === 'Admin Finalized' || r.status === 'Approved')
    .reduce((acc, r) => acc + Number(r.points || 0), 0);

  // Use the greater of the two to avoid dropping historical points
  const totalApprovedPoints = Math.max(totalFromRequests, totalFromProfile);

  // This is the fixed pending count
  const pendingCount = requests.filter(
    req => req.status === 'Submitted' || req.status === 'FA Approved' || req.status === 'More Info Required'
  ).length;

  const rejectedCount = requests.filter(req => req.status === 'Rejected').length;

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500">Track your activity points and requests</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl p-6 shadow-md bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Approved Points</p>
              <p className="mt-1 text-4xl font-extrabold">{totalApprovedPoints}</p>
            </div>
            <div className="opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
                <path d="M16 3H8a1 1 0 00-1 1v4a5 5 0 106 4.9V4a1 1 0 00-1-1zm-5 6V5h2v4a3 3 0 11-2 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl p-6 shadow-md bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Requests</p>
              <p className="mt-1 text-4xl font-extrabold">{pendingCount}</p>
            </div>
            <div className="opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
                <path d="M12 8V12l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl p-6 shadow-md bg-gradient-to-r from-rose-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected Requests</p>
              <p className="mt-1 text-4xl font-extrabold">{rejectedCount}</p>
            </div>
            <div className="opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.24 12.83l-1.41 1.41L12 13.41l-2.83 2.83-1.41-1.41L10.59 12 7.76 9.17l1.41-1.41L12 10.59l2.83-2.83 1.41 1.41L13.41 12l2.83 2.83z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Request Form */}
      <div className="rounded-xl bg-white/80 backdrop-blur shadow-md border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit New Activity Request</h3>
        <RequestForm onNewRequest={fetchData} />
      </div>

      {/* Requests Table */}
      <div className="rounded-xl bg-white shadow-md border border-gray-100">
        <div className="p-6 pb-0">
          <h3 className="text-xl font-semibold text-gray-900">My Requests History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comments / Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                      (req.status === 'Admin Finalized' || req.status === 'Approved') ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-800 ring-1 ring-red-600/20' :
                      'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20'
                    }`}>
                      {(req.status === 'Admin Finalized' || req.status === 'Approved') ? 'Approved' : req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 italic">
                    {req.comments.length > 0 ? req.comments[req.comments.length - 1].text : '---'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {req.status === 'More Info Required' ? (
                      <ResubmitInline request={req} onDone={fetchData} />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ResubmitInline = ({ request, onDone }) => {
  const [file, setFile] = useState(null);
  const [points, setPoints] = useState(request.points || 0);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setMsg('Please select a new proof file.'); return; }
    const fd = new FormData();
    fd.append('points', String(points));
    fd.append('proof', file);
    try {
      setSubmitting(true);
      await resubmitRequest(request._id, fd);
      setMsg('Resubmitted for approval.');
      onDone();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Resubmission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input type="number" min={1} value={points} onChange={(e)=>setPoints(Number(e.target.value))} className="w-20 px-2 py-1 border rounded" />
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="text-xs" />
      <button type="submit" disabled={submitting} className={`px-3 py-1.5 rounded text-white text-xs ${submitting? 'bg-indigo-400':'bg-indigo-600 hover:bg-indigo-700'}`}>Resubmit</button>
      {msg && <span className="text-xs text-gray-500">{msg}</span>}
    </form>
  );
};

export default StudentDashboard;

