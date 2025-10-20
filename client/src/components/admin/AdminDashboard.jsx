import { useState } from 'react';
import AssignFARequests from './AssignFARequests';
import FinalizeRequests from './FinalizeRequests';

const AdminDashboard = () => {
  const [view, setView] = useState('assign');

  const getButtonClass = (tabName) => {
    return view === tabName
      ? 'px-4 py-2 font-semibold text-white bg-blue-600 rounded-md'
      : 'px-4 py-2 font-semibold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <nav className="flex space-x-4">
          <button onClick={() => setView('assign')} className={getButtonClass('assign')}>
            Pending Assignment
          </button>
          <button onClick={() => setView('finalize')} className={getButtonClass('finalize')}>
            Pending Final Approval
          </button>
        </nav>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {view === 'assign' && <AssignFARequests />}
        {view === 'finalize' && <FinalizeRequests />}
      </div>
    </div>
  );
};

export default AdminDashboard;