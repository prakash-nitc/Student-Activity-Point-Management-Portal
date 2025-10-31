import { useEffect, useState } from 'react';
import { assignPrimaryFA, getAdminAllUsers } from '../../services/api';

const UserManagement = () => {
    const [students, setStudents] = useState([]);
    const [fas, setFAs] = useState([]);
    const [selectedFAs, setSelectedFAs] = useState({});

    const fetchData = async () => {
        try {
            const { data } = await getAdminAllUsers();
            setStudents(data.filter(user => user.role === 'student'));
            setFAs(data.filter(user => user.role === 'fa'));
            
            // Pre-fill the dropdowns with current assignments
            const initialSelections = {};
            data.filter(user => user.role === 'student').forEach(student => {
                if (student.primary_fa_id) {
                    initialSelections[student._id] = student.primary_fa_id;
                }
            });
            setSelectedFAs(initialSelections);
            
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handleSelectChange = (studentId, faId) => {
        setSelectedFAs(prev => ({ ...prev, [studentId]: faId }));
    };

    const handleAssign = async (studentId) => {
        const faId = selectedFAs[studentId];
        if (!faId) {
            alert('Please select a Faculty Advisor to assign.');
            return;
        }
        try {
            await assignPrimaryFA(studentId, faId);
            alert('Primary FA assigned successfully!');
            fetchData(); // Refresh data to show update
        } catch (error) {
            alert('Failed to assign FA.');
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User Management (F3)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Primary FA</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map(student => (
                            <tr key={student._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                <td className="px-6 py-4 whitespace-nowrowrap text-sm text-gray-500">{student.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        value={selectedFAs[student._id] || ''}
                                        onChange={(e) => handleSelectChange(student._id, e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                    >
                                        <option value="">Select an FA</option>
                                        {fas.map(fa => (
                                            <option key={fa._id} value={fa._id}>{fa.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleAssign(student._id)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Assign</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;