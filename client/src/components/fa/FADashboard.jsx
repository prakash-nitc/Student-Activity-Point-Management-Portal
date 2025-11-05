import React, { useEffect, useMemo, useState } from 'react';
import { getRequestsForFA, updateFAStatus, bulkApproveRequests } from '../../services/api';

const FADashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null); // request object
  const [comment, setComment] = useState('');

  const fetchPending = async () => {
    const { data } = await getRequestsForFA();
    setRequests(data || []);
  };

  useEffect(() => { fetchPending(); }, []);

  const pendingCount = requests.length;
  const handleToggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const act = async (id, status, note) => {
    let c = note ?? '';
    if ((status === 'Rejected' || status === 'More Info Required') && !c) {
      const p = prompt(`Add a comment for: ${status}`);
      if (!p) return;
      c = p;
    }
    await updateFAStatus(id, { status, comment: c });
    setModal(null);
    setComment('');
    await fetchPending();
  };

  const bulkApprove = async () => {
    if (selected.length === 0) return;
    await bulkApproveRequests(selected);
    setSelected([]);
    await fetchPending();
  };

  const lastRefresh = useMemo(() => new Date().toLocaleString(), [requests]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Faculty Advisor Dashboard</h2>
            <p className="opacity-90">Review, request info, or approve student activities.</p>
          </div>
          <button
            onClick={bulkApprove}
            disabled={selected.length === 0}
            className={`btn-glow rounded-lg px-4 py-2 font-semibold shadow ${selected.length===0?'bg-white/30 cursor-not-allowed':'bg-white/90 text-indigo-700 hover:bg-white'}`}
          >
            Approve Selected ({selected.length})
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Pending" value={pendingCount} color="from-amber-500 to-yellow-500" icon={ClockIcon} />
        <Stat title="Selected" value={selected.length} color="from-sky-500 to-indigo-600" icon={CheckIcon} />
        <Stat title="Last refresh" value={lastRefresh} color="from-emerald-500 to-green-600" icon={RefreshIcon} small />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Pending Advisee Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th>Select</Th>
                <Th>Student</Th>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Points</Th>
                <Th>Submitted</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <Td>
                    <input type="checkbox" checked={selected.includes(r._id)} onChange={()=>handleToggle(r._id)} />
                  </Td>
                  <Td className="font-medium">{r.studentId?.name ?? 'Unknown'}</Td>
                  <Td>{r.title}</Td>
                  <Td>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20">{r.category}</span>
                  </Td>
                  <Td>{r.points}</Td>
                  <Td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200" onClick={()=>{setModal(r); setComment('');}}>View</button>
                      <button className="px-2.5 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700" onClick={()=>act(r._id,'FA Approved')}>Approve</button>
                      <button className="px-2.5 py-1 text-xs rounded-md bg-amber-500 text-white hover:bg-amber-600" onClick={()=>act(r._id,'More Info Required')}>Info</button>
                      <button className="px-2.5 py-1 text-xs rounded-md bg-rose-600 text-white hover:bg-rose-700" onClick={()=>act(r._id,'Rejected')}>Reject</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{modal.title}</h4>
                <p className="text-sm text-gray-500">{modal.studentId?.name} • {modal.studentId?.email}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Category" value={modal.category} />
              <Info label="Points" value={String(modal.points)} />
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-600">Proof:</p>
                {modal.proof ? (
                  <a href={`http://localhost:5000/${modal.proof}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View document</a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea value={comment} onChange={(e)=>setComment(e.target.value)} rows={3} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Add context or a note (required for Reject/Info)" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600" onClick={()=>act(modal._id,'More Info Required', comment)}>Request Info</button>
              <button className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700" onClick={()=>act(modal._id,'Rejected', comment)}>Reject</button>
              <button className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700" onClick={()=>act(modal._id,'FA Approved', comment)}>Approve</button>
              <button className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{children}</th>
);
const Td = ({ children, className='' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

const Stat = ({ title, value, color, icon: Icon, small }) => (
  <div className={`relative overflow-hidden rounded-xl p-5 shadow-md text-white bg-gradient-to-r ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`opacity-90 ${small? 'text-xs':'text-sm'}`}>{title}</p>
        <p className={`${small? 'text-base' : 'text-3xl'} font-extrabold mt-1`}>{value}</p>
      </div>
      <div className="opacity-90"><Icon /></div>
    </div>
  </div>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.4l3.6 2.1-.8 1.3L11 13V6h2v6.4z"/></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10"><path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10"><path d="M17.7 6.3A8 8 0 106 17.7V15h2v5H3v-2h2.3A10 10 0 1120 12h-2a8 8 0 00-.3-5.7z"/></svg>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value}</p>
  </div>
);

export default FADashboard;

