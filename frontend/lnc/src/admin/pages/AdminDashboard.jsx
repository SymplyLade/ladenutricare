// import { useState, useEffect } from 'react';
// import { getDashboardStats } from '../../services/admin';
// import {
//   UsersIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   CurrencyDollarIcon,
//   CheckCircleIcon,
// } from '@heroicons/react/24/outline';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await getDashboardStats();
//       setStats(response.data);
//     } catch (err) {
//       setError('Failed to load dashboard statistics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     { name: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: 'bg-blue-500' },
//     { name: 'Total Doctors', value: stats?.totalDoctors || 0, icon: UserGroupIcon, color: 'bg-green-500' },
//     { name: 'Appointments Today', value: stats?.appointmentsToday || 0, icon: CalendarIcon, color: 'bg-purple-500' },
//     { name: 'Pending Appointments', value: stats?.pendingAppointments || 0, icon: CalendarIcon, color: 'bg-yellow-500' },
//     { name: 'Total Payments', value: `$${stats?.totalRevenue || 0}`, icon: CurrencyDollarIcon, color: 'bg-indigo-500' },
//     { name: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: CheckCircleIcon, color: 'bg-red-500' },
//   ];

//   if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
//   if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
//         {statCards.map((card) => (
//           <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="p-5">
//               <div className="flex items-center">
//                 <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
//                   <card.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-5 w-0 flex-1">
//                   <dl>
//                     <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
//                     <dd className="text-lg font-semibold text-gray-900">{card.value}</dd>
//                   </dl>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent activity placeholder – can be expanded later */}
//       <div className="mt-8">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
//         <div className="bg-white shadow rounded-lg p-6">
//           <p className="text-gray-500">Activity log will appear here.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;





import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/admin';
import { UsersIcon, UserGroupIcon, CalendarIcon, CreditCardIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Total Doctors', value: stats?.totalDoctors || 0, icon: UserGroupIcon, color: 'bg-green-500' },
    { name: 'Appointments Today', value: stats?.appointmentsToday || 0, icon: CalendarIcon, color: 'bg-purple-500' },
    { name: 'Pending Appointments', value: stats?.pendingAppointments || 0, icon: CalendarIcon, color: 'bg-yellow-500' },
    { name: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: CurrencyDollarIcon, color: 'bg-indigo-500' },
    { name: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: CheckCircleIcon, color: 'bg-red-500' },
  ];

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard key={card.name} title={card.name} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Activity log will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;