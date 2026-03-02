// import { useState } from 'react';
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//   HomeIcon,
//   UsersIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   BeakerIcon,
//   Cog6ToothIcon,
//   ArrowLeftOnRectangleIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';

// const navigation = [
//   { name: 'Dashboard', href: '/admin', icon: HomeIcon },
//   { name: 'Users', href: '/admin/users', icon: UsersIcon },
//   { name: 'Doctors', href: '/admin/doctors', icon: UserGroupIcon },
//   { name: 'Appointments', href: '/admin/appointments', icon: CalendarIcon },
//   { name: 'Payments', href: '/admin/payments', icon: CreditCardIcon },
//   { name: 'Nutrition', href: '/admin/nutrition', icon: BeakerIcon },
//   { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
// ];

// const AdminLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Mobile sidebar */}
//       <div className={`fixed inset-0 z-40 flex lg:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
//         <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
//         <div className={`relative flex w-64 max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <div className="absolute top-0 right-0 -mr-14 p-1">
//             <button className="rounded-md p-2 text-white hover:bg-gray-700" onClick={() => setSidebarOpen(false)}>
//               <XMarkIcon className="h-6 w-6" />
//             </button>
//           </div>
//           <div className="flex flex-shrink-0 items-center px-4">
//             <span className="text-xl font-bold text-indigo-600">Admin</span>
//           </div>
//           <nav className="mt-5 flex-1 space-y-1 px-2">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-indigo-500" />
//                 {item.name}
//               </Link>
//             ))}
//             <button
//               onClick={handleLogout}
//               className="group w-full flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
//             >
//               <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
//               Logout
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
//         <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
//           <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
//             <div className="flex flex-shrink-0 items-center px-4">
//               <span className="text-xl font-bold text-indigo-600">Admin Panel</span>
//             </div>
//             <nav className="mt-5 flex-1 space-y-1 px-2">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
//                 >
//                   <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-indigo-500" />
//                   {item.name}
//                 </Link>
//               ))}
//             </nav>
//           </div>
//           <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
//             <div className="flex items-center">
//               <div>
//                 <p className="text-sm font-medium text-gray-700">{user?.name}</p>
//                 <p className="text-xs text-gray-500">Administrator</p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="ml-auto text-gray-400 hover:text-red-500"
//                 title="Logout"
//               >
//                 <ArrowLeftOnRectangleIcon className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
//           <button
//             className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Bars3Icon className="h-6 w-6" />
//           </button>
//         </div>
//         <main className="py-6">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;



import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-40 flex lg:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex w-64 max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-shrink-0 items-center px-4">
            <span className="text-xl font-bold text-indigo-600">Admin Panel</span>
          </div>
          <AdminSidebar mobile onItemClick={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-shrink-0 items-center px-4 h-16 border-b border-gray-200">
            <span className="text-xl font-bold text-indigo-600">Admin Panel</span>
          </div>
          <AdminSidebar />
        </div>
      </div>

      {/* Header for mobile */}
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;