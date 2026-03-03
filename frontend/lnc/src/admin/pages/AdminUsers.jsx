// import { useState, useEffect } from 'react';
// import { getAllUsers, updateUser, deleteUser } from '../../services/admin';
// import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await getAllUsers();
//       setUsers(response.data);
//     } catch (err) {
//       setError('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingId(user.id);
//     setEditForm(user);
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({});
//   };

//   const handleSave = async (id) => {
//     try {
//       await updateUser(id, editForm);
//       setUsers(users.map(u => u.id === id ? { ...u, ...editForm } : u));
//       setEditingId(null);
//     } catch (err) {
//       setError('Failed to update user');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     try {
//       await deleteUser(id);
//       setUsers(users.filter(u => u.id !== id));
//     } catch (err) {
//       setError('Failed to delete user');
//     }
//   };

//   const handleChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Users</h1>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {editingId === user.id ? (
//                     <input
//                       type="text"
//                       name="name"
//                       value={editForm.name || ''}
//                       onChange={handleChange}
//                       className="border rounded px-2 py-1 w-full"
//                     />
//                   ) : (
//                     user.name
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {editingId === user.id ? (
//                     <select
//                       name="role"
//                       value={editForm.role || ''}
//                       onChange={handleChange}
//                       className="border rounded px-2 py-1"
//                     >
//                       <option value="user">User</option>
//                       <option value="doctor">Doctor</option>
//                       <option value="admin">Admin</option>
//                     </select>
//                   ) : (
//                     user.role
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   {editingId === user.id ? (
//                     <>
//                       <button
//                         onClick={() => handleSave(user.id)}
//                         className="text-green-600 hover:text-green-900 mr-3"
//                       >
//                         <CheckIcon className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="text-gray-600 hover:text-gray-900"
//                       >
//                         <XMarkIcon className="h-5 w-5" />
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="text-indigo-600 hover:text-indigo-900 mr-3"
//                       >
//                         <PencilIcon className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;




import { useState, useEffect } from 'react';
import { getAllUsers, updateUser, deleteUser } from '../../services/admin';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import StatusBadge from '../components/StatusBadge';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm(user);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    try {
      await updateUser(id, editForm);
      setUsers(users.map(u => (u.id === id ? { ...u, ...editForm } : u)));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Users</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === user.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === user.id ? (
                    <select name="role" value={editForm.role || ''} onChange={handleChange} className="border rounded px-2 py-1">
                      <option value="user">User</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={user.is_active ? 'active' : 'inactive'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === user.id ? (
                    <>
                      <button onClick={() => handleSave(user.id)} className="text-green-600 hover:text-green-900 mr-3">
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-900">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;