import { useState } from 'react';
import CategoryManagement from './CategoryManagement';
import FinalApprovalQueue from './FinalizeRequests';

const AdminDashboard = () => {
  const [view, setView] = useState('approvals');

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Administrator Panel</h2>
            <p className="opacity-90">Finalize approvals and curate categories.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full p-1">
            <TabButton active={view==='approvals'} onClick={()=>setView('approvals')}>Final Approvals</TabButton>
            <TabButton active={view==='categories'} onClick={()=>setView('categories')}>Categories</TabButton>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="sm:hidden mt-3 flex gap-2">
          <TabButton active={view==='approvals'} onClick={()=>setView('approvals')}>Final Approvals</TabButton>
          <TabButton active={view==='categories'} onClick={()=>setView('categories')}>Categories</TabButton>
        </div>
      </div>

      {/* Content card with subtle glass look */}
      <div className="rounded-xl bg-white/90 backdrop-blur shadow-md border border-gray-100 p-0 overflow-hidden">
        {view === 'approvals' && (
          <Section title="Final Approval Queue">
            <FinalApprovalQueue />
          </Section>
        )}
        {view === 'categories' && (
          <Section title="Category Management">
            <CategoryManagement />
          </Section>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-semibold transition shadow-sm ${
      active ? 'bg-white text-indigo-700' : 'text-white/90 hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

const Section = ({ title, children }) => (
  <div>
    <div className="px-6 py-4 bg-gray-50 border-b">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default AdminDashboard;
