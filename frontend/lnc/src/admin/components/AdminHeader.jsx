// import { Fragment } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../../context/AuthContext';

// const AdminHeader = ({ onMenuClick }) => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
//       <div className="flex items-center justify-between">
//         <button
//           type="button"
//           className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//           onClick={onMenuClick}
//         >
//           <span className="sr-only">Open sidebar</span>
//           <Bars3Icon className="h-6 w-6" />
//         </button>

//         {/* Right side – notifications and user menu */}
//         <div className="flex items-center space-x-3 px-4">
//           <button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
//             <BellIcon className="h-6 w-6" />
//           </button>

//           <Menu as="div" className="relative">
//             <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
//               <img
//                 className="h-8 w-8 rounded-full"
//                 src={user?.profile_picture || 'https://via.placeholder.com/32'}
//                 alt=""
//               />
//             </Menu.Button>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={logout}
//                       className={`${
//                         active ? 'bg-gray-100' : ''
//                       } block w-full text-left px-4 py-2 text-sm text-gray-700`}
//                     >
//                       Logout
//                     </button>
//                   )}
//                 </Menu.Item>
//               </Menu.Items>
//             </Transition>
//           </Menu>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHeader;





// import { Fragment } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../../context/AuthContext';

// const AdminHeader = ({ onMenuClick }) => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
//       <div className="flex items-center justify-between">
//         <button
//           type="button"
//           className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//           onClick={onMenuClick}
//         >
//           <Bars3Icon className="h-6 w-6" />
//         </button>
//         <div className="flex items-center space-x-3 px-4">
//           <button className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
//             <BellIcon className="h-6 w-6" />
//           </button>
//           <Menu as="div" className="relative">
//             <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
//               <img
//                 className="h-8 w-8 rounded-full"
//                 src={user?.profile_picture || 'https://via.placeholder.com/32'}
//                 alt=""
//               />
//             </Menu.Button>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                 <Menu.Item>
//                   {({ active }) => (
//                     <button
//                       onClick={logout}
//                       className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
//                     >
//                       Logout
//                     </button>
//                   )}
//                 </Menu.Item>
//               </Menu.Items>
//             </Transition>
//           </Menu>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHeader;




import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../../components/NotificationBell';
import UserAvatar from '../../components/UserAvatar';

const AdminHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  return (
    <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-3 px-4">
          <NotificationBell />
          <Menu as="div" className="relative">
            <Menu.Button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-2 text-sm shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <UserAvatar
                name={user?.name}
                imageUrl={user?.profile_picture}
                imageFailed={avatarLoadError}
                onImageError={() => setAvatarLoadError(true)}
                sizeClass="h-8 w-8"
              />
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${active ? 'bg-red-50 text-red-700' : 'text-red-600'} block w-full rounded-lg px-3 py-2 text-left text-sm font-medium`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
