import { useEffect, useState } from 'react';
// 1. Correct the function name in the import
import { getRequestsForFA } from '../../services/api';

const FADashboard = () => {
  const [requests, setRequests] = useState([]);

  const fetchPendingRequests = async () => {
    try {
      // 2. Correct the function name being called here
      const { data } = await getRequestsForFA(); 
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
      // This function name needs to be created for the new workflow
      // Let's use submitFAReview for now as per our new logic
      await submitFAReview(id, { comment });
      fetchPendingRequests();
    } catch (error) {
      alert('Action failed. Please try again.');
    }
  };
  
  // Let's update the FA's action to match the new workflow
  const handleReview = async (requestId) => {
    const comment = prompt("Please provide your review comments for the admin:");
    if (comment) {
      try {
        // We need to import submitFAReview
        const { submitFAReview } = await import('../../services/api');
        await submitFAReview(requestId, { comment });
        alert("Review submitted to Admin.");
        fetchPendingRequests(); // Refresh list
      } catch (error) {
        alert("Failed to submit review.");
      }
    }
  };


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">Requests for Your Review</h3>
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
                  <button onClick={() => handleReview(req._id)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Review & Revert to Admin</button>
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