// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import {
//   HomeIcon,
//   UsersIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   BeakerIcon,
//   Cog6ToothIcon,
//   ArrowLeftOnRectangleIcon,
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

// const AdminSidebar = ({ mobile = false, onItemClick }) => {
//   const location = useLocation();
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     // Navigation will be handled by App's logout redirect
//   };

//   const linkClasses = (path) => {
//     const isActive = location.pathname === path;
//     return `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
//       isActive
//         ? 'bg-gray-100 text-indigo-600'
//         : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
//     }`;
//   };

//   return (
//     <div className="flex flex-1 flex-col overflow-y-auto">
//       <nav className="flex-1 space-y-1 px-2">
//         {navigation.map((item) => (
//           <Link
//             key={item.name}
//             to={item.href}
//             className={linkClasses(item.href)}
//             onClick={mobile ? onItemClick : undefined}
//           >
//             <item.icon
//               className={`mr-3 h-5 w-5 flex-shrink-0 ${
//                 location.pathname === item.href
//                   ? 'text-indigo-500'
//                   : 'text-gray-400 group-hover:text-indigo-500'
//               }`}
//             />
//             {item.name}
//           </Link>
//         ))}
//         <button
//           onClick={handleLogout}
//           className="group w-full flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
//         >
//           <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
//           Logout
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default AdminSidebar;



import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  CreditCardIcon,
  BeakerIcon,
  Cog6ToothIcon,
  BellIcon,               // ✅ Make sure this is present
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Doctors', href: '/admin/doctors', icon: UserGroupIcon },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarIcon },
  { name: 'Payments', href: '/admin/payments', icon: CreditCardIcon },
  { name: 'Nutrition', href: '/admin/nutrition', icon: BeakerIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon }, // ✅ Using BellIcon
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

const AdminSidebar = ({ mobile = false, onItemClick }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const linkClasses = (path) => {
    const isActive = location.pathname === path;
    return `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
      isActive ? 'bg-gray-100 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
    }`;
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={linkClasses(item.href)}
            onClick={mobile ? onItemClick : undefined}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                location.pathname === item.href ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
              }`}
            />
            {item.name}
          </Link>
        ))}
        <button
          onClick={logout}
          className="group w-full flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
        >
          <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;