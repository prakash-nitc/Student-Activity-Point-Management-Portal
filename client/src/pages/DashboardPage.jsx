import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import FADashboard from '../components/fa/FADashboard';
import StudentDashboard from '../components/student/StudentDashboard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  const renderDashboard = () => {
    if (!userInfo) return null;

    switch (userInfo.role) {
      case 'student':
        return <StudentDashboard />;
      case 'fa':
        return <FADashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* -- STYLED HEADER WITH LOGOUT BUTTON -- */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userInfo?.name}
            </h1>
            <p className="text-sm text-gray-500 capitalize">{userInfo?.role} Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </header>

        {/* -- MAIN CONTENT AREA -- */}
        <main>
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;