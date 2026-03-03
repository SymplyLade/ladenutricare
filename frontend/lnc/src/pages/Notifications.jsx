// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getNotifications, markAsRead, markAllRead } from '../services/notifications';
// import { formatDistanceToNow } from 'date-fns';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const response = await getNotifications(0, 50);
//       setNotifications(response.data);
//     } catch (err) {
//       setError('Failed to load notifications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkRead = async (id) => {
//     try {
//       await markAsRead(id);
//       setNotifications(notifications.map(n =>
//         n.id === id ? { ...n, is_read: true } : n
//       ));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleMarkAllRead = async () => {
//     try {
//       await markAllRead();
//       setNotifications(notifications.map(n => ({ ...n, is_read: true })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
//         <button
//           onClick={handleMarkAllRead}
//           className="text-sm text-indigo-600 hover:text-indigo-500"
//         >
//           Mark all as read
//         </button>
//       </div>
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//       {notifications.length === 0 ? (
//         <p className="text-gray-500">No notifications</p>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {notifications.map((notif) => (
//               <li key={notif.id} className={`px-4 py-4 ${!notif.is_read ? 'bg-blue-50' : ''}`}>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">{notif.title}</p>
//                     <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
//                     <p className="text-xs text-gray-400 mt-2">
//                       {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
//                     </p>
//                   </div>
//                   {!notif.is_read && (
//                     <button
//                       onClick={() => handleMarkRead(notif.id)}
//                       className="ml-4 text-xs text-indigo-600 hover:text-indigo-500"
//                     >
//                       Mark read
//                     </button>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;





import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead, markAllRead } from '../services/notifications';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(0, 50);
      setNotifications(response.data);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button onClick={handleMarkAllRead} className="text-sm text-indigo-600 hover:text-indigo-500">
          Mark all as read
        </button>
      </div>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <li key={notif.id} className={`px-4 py-4 ${!notif.is_read ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="ml-4 text-xs text-indigo-600 hover:text-indigo-500"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;