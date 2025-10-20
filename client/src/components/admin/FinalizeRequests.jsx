import { useEffect, useState } from 'react';
import { getFinalApprovalQueue, updateRequestStatus } from '../../services/api';

const FinalizeRequests = () => {
    const [requests, setRequests] = useState([]);

    const fetchQueue = async () => {
        try {
            const { data } = await getFinalApprovalQueue(); 
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch final approval queue", error);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleAction = async (id, status) => {
        const comment = prompt('Add an optional comment for your final decision:');
        try {
            // This line has been corrected from 'updateRequest-status'
            await updateRequestStatus(id, { status, comment }); 
            alert('Final decision recorded!');
            fetchQueue();
        } catch (error) {
            alert('Action failed. Please try again.');
        }
    };
    
    if (requests.length === 0) {
        return <p>No requests are pending final approval.</p>;
    }

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Requests Pending Final Approval</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FA Review</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map(req => (
                            <tr key={req._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.studentId.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">"{req.comments[req.comments.length - 1]?.text}"</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => handleAction(req._id, 'Approved')} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
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

export default FinalizeRequests;