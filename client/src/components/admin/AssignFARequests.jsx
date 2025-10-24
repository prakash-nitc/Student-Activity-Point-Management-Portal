import { useEffect, useState } from 'react';
import { assignFaToRequest, getAllUsers, getUnassignedRequests } from '../../services/api';

const AssignFARequests = () => {
  const [requests, setRequests] = useState([]);
  const [fas, setFAs] = useState([]);
  const [selectedFAs, setSelectedFAs] = useState({});

  const fetchData = async () => {
    try {
      const requestsRes = await getUnassignedRequests();
      const usersRes = await getAllUsers();
      setRequests(requestsRes.data);
      setFAs(usersRes.data.filter(user => user.role === 'fa'));
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (requestId) => {
    const faId = selectedFAs[requestId];
    if (!faId) {
      alert('Please select a Faculty Advisor.');
      return;
    }
    try {
      await assignFaToRequest(requestId, faId);
      alert('FA assigned successfully!');
      fetchData(); // Refresh the list
    } catch (error) {
      alert('Failed to assign FA.');
      console.error(error);
    }
  };

  const handleSelectChange = (requestId, faId) => {
    setSelectedFAs(prev => ({ ...prev, [requestId]: faId }));
  };
  
  if (requests.length === 0) {
    return <p>No new requests are pending assignment.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Requests Pending Assignment</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.studentId.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={selectedFAs[req._id] || ''}
                      onChange={(e) => handleSelectChange(req._id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="" disabled>Select an FA</option>
                      {fas.map(fa => (
                        <option key={fa._id} value={fa._id}>{fa.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleAssign(req._id)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Assign</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignFARequests;