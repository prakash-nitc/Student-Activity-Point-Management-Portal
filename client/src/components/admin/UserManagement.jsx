// client/src/components/admin/UserManagement.jsx
import { useEffect, useState } from 'react';
import { assignPrimaryFa, getAllUsers } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [fas, setFAs] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await getAllUsers();
            setUsers(data);
            setFAs(data.filter(u => u.role === 'fa'));
            setStudents(data.filter(u => u.role === 'student'));
        };
        fetchUsers();
    }, []);

    const handleAssign = async (studentId, faId) => {
        try {
            await assignPrimaryFa(studentId, faId);
            alert('FA assigned!');
            // Optionally refresh data
        } catch (error) {
            alert('Failed to assign FA');
        }
    };

    return (
        <div>
            <h3>User Management</h3>
            <table>
                {/* Table to display students and assign FAs */}
            </table>
        </div>
    );
};
export default UserManagement;