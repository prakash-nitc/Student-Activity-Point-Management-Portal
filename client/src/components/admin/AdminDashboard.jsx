import { useState } from 'react';
import CategoryManagement from './CategoryManagement';
import FinalApprovalQueue from './FinalApprovalQueue';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [view, setView] = useState('approvals');

  const getButtonClass = (tabName) => {
    return view === tabName
      ? 'px-4 py-2 font-semibold text-white bg-blue-600 rounded-md'
      : 'px-4 py-2 font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <nav className="flex space-x-4">
          <button onClick={() => setView('approvals')} className={getButtonClass('approvals')}>Final Approvals</button>
          <button onClick={() => setView('users')} className={getButtonClass('users')}>User Management</button>
          <button onClick={() => setView('categories')} className={getButtonClass('categories')}>Category Management</button>
        </nav>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {view === 'approvals' && <FinalApprovalQueue />}
        {view === 'users' && <UserManagement />}
        {view === 'categories' && <CategoryManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;