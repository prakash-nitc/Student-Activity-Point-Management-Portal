// import { useEffect, useState } from 'react';
// import { getMyRequests, getUserProfile } from '../../services/api';
// import RequestForm from './RequestForm';

// const StudentDashboard = () => {
//   const [requests, setRequests] = useState([]);
//   // We still fetch profile, but we won't use it for the total count
//   const [profile, setProfile] = useState(null);

//   const fetchData = async () => {
//     try {
//       const requestsRes = await getMyRequests();
//       const profileRes = await getUserProfile();
//       setRequests(requestsRes.data);
//       setProfile(profileRes.data);
//     } catch (error) {
//       console.error("Failed to fetch dashboard data", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // --- THIS IS THE FIXED LOGIC FOR THE CARDS ---
  
//   // 1. Total Approved Points: Sums points from all requests marked 'Admin Finalized' or the old 'Approved'
//   const totalApprovedPoints = requests
//     .filter(req => req.status === 'Admin Finalized' || req.status === 'Approved')
//     .reduce((acc, req) => acc + req.points, 0);

//   // 2. Pending Count: Only counts requests actively waiting for approval
//   const pendingCount = requests.filter(
//     req => req.status === 'Submitted' || req.status === 'FA Approved'
//   ).length;

//   // 3. Rejected Count: Remains the same
//   const rejectedCount = requests.filter(req => req.status === 'Rejected').length;
//   // ---------------------------------------------

//   return (
//     <div className="space-y-6">
      
//       {/* --- Stat Cards (will now show correct numbers) --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white shadow-md rounded-lg p-6 text-center">
//           <h4 className="text-lg font-semibold text-gray-700">Total Approved Points</h4>
//           <p className="text-3xl font-bold text-green-600">{totalApprovedPoints}</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-6 text-center">
//           <h4 className="text-lg font-semibold text-gray-700">Pending Requests</h4>
//           <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
//         </div>
//         <div className="bg-white shadow-md rounded-lg p-6 text-center">
//           <h4 className="text-lg font-semibold text-gray-700">Rejected Requests</h4>
//           <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
//         </div>
//       </div>

//       {/* -- Submit Request Form Card -- */}
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Submit New Activity Request</h3>
//         <RequestForm onNewRequest={fetchData} />
//       </div>

//       {/* -- My Requests Table Card -- */}
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">My Requests History</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments / Reason</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {requests.map((req) => (
//                 <tr key={req._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.title}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.points}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
                    
//                     {/* --- THIS IS THE FIXED STATUS DISPLAY --- */}
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       (req.status === 'Admin Finalized' || req.status === 'Approved') ? 'bg-green-100 text-green-800' :
//                       req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                       'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {/* This makes all "Approved" types (old and new) just say "Approved" */}
//                       {(req.status === 'Admin Finalized' || req.status === 'Approved') ? 'Approved' : req.status}
//                     </span>
//                     {/* ------------------------------------ */}

//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
//                     {req.comments.length > 0 ? req.comments[req.comments.length - 1].text : '---'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import { getMyRequests, getUserProfile } from '../../services/api';
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
    <div className="space-y-6">
      
      {/* --- Stat Cards (will now show correct numbers) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-700">Total Approved Points</h4>
          <p className="text-3xl font-bold text-green-600">{totalApprovedPoints}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-700">Pending Requests</h4>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-700">Rejected Requests</h4>
          <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
        </div>
      </div>

      {/* -- Submit Request Form Card -- */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Submit New Activity Request</h3>
        <RequestForm onNewRequest={fetchData} />
      </div>

      {/* -- My Requests Table Card -- */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">My Requests History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments / Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (req.status === 'Admin Finalized' || req.status === 'Approved') ? 'bg-green-100 text-green-800' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(req.status === 'Admin Finalized' || req.status === 'Approved') ? 'Approved' : req.status}
                    </span>

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                    {req.comments.length > 0 ? req.comments[req.comments.length - 1].text : '---'}
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

export default StudentDashboard;
