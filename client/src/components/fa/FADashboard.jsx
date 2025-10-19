import { useEffect, useState } from 'react';
import { getPendingRequestsForFA, updateRequestStatus } from '../../services/api';

const FADashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchPendingRequests = async () => {
    try {
      const { data } = await getPendingRequestsForFA();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch pending requests", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleAction = async (id, status) => {
    let comment = '';
    if (status === 'Rejected') {
      comment = prompt('Please provide a reason for rejection:');
      if (!comment) return;
    }
    
    try {
      await updateRequestStatus(id, { status, comment });
      fetchPendingRequests();
    } catch (error) {
      alert('Action failed. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">Pending Advisee Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.studentId.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.points}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleAction(req._id, 'FA Approved')} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                  <button onClick={() => handleAction(req._id, 'Rejected')} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FADashboard;