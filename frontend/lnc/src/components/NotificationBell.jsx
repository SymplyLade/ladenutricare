import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const { user } = useAuth();

  const role = String(user?.role || '').toLowerCase();
  const isAdmin = role.endsWith('admin');
  const isDoctor = role.endsWith('doctor');

  const viewAllLink = isAdmin ? '/admin/notifications' : '/notifications';
  const fallbackLink = isAdmin ? '/admin/notifications' : isDoctor ? '/doctor-dashboard' : '/appointments';

  const handleNotificationClick = async (id) => {
    await markAsRead(id);
  };

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <Menu.Item key={notif.id}>
                  {({ active }) => (
                    <Link
                      to={notif.link || fallbackLink}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`block px-4 py-3 text-sm ${
                        active ? 'bg-gray-50' : ''
                      } ${!notif.is_read ? 'bg-blue-50' : ''}`}
                    >
                      <p className="font-medium text-gray-900">{notif.title}</p>
                      <p className="text-gray-600 truncate">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </Link>
                  )}
                </Menu.Item>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-2">
            <Link to={viewAllLink} className="text-sm text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationBell;
