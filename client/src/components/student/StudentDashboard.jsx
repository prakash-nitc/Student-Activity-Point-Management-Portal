import { useEffect, useState } from 'react';
import { getMyRequests } from '../../services/api';
import RequestForm from './RequestForm';

const StudentDashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data } = await getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      {/* -- Submit Request Form Card -- */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">Submit New Activity Request</h3>
        <RequestForm onNewRequest={fetchRequests} />
      </div>

      {/* -- My Requests Table Card -- */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">My Requests</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.status}</td>
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