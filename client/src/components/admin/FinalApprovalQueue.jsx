import { useEffect, useState } from 'react';
import { getFinalApprovalQueue, updateRequestStatus } from '../../services/api';

const FinalApprovalQueue = () => {
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
        const comment = prompt('Add an optional comment for your decision:');
        try {
            await updateRequestStatus(id, { status, comment });
            alert('Action completed successfully!');
            fetchQueue(); // Refresh the list
        } catch (error) {
            alert('Action failed. Please try again.');
        }
    };

    if (requests.length === 0) {
        return <p>There are no requests waiting for final approval.</p>;
    }

    return (
        <div className="activity-list">
            <h4>Requests Awaiting Final Approval</h4>
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Title</th>
                        <th>Approved by FA</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req._id}>
                            <td>{req.studentId.name}</td>
                            <td>{req.title}</td>
                            <td>{req.assignedFAId.name}</td>
                            <td>
                                <button onClick={() => handleAction(req._id, 'Admin Finalized')}>Final Approve</button>
                                <button onClick={() => handleAction(req._id, 'Rejected')} style={{marginLeft: '10px'}}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinalApprovalQueue;