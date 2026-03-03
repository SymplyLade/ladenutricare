// import { useState, useEffect } from 'react';
// import { PlusIcon, PhoneIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';
// import api from '../services/api';

// const EmergencyContacts = () => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: '', relation: '', phone: '' });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     try {
//       const response = await api.get('/emergency');
//       setContacts(response.data);
//     } catch (err) {
//       setError('Failed to load emergency contacts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await api.post('/emergency', formData);
//       setContacts([...contacts, response.data]);
//       setShowForm(false);
//       setFormData({ name: '', relation: '', phone: '' });
//     } catch (err) {
//       setError('Failed to add contact');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this contact?')) return;
//     try {
//       await api.delete(`/emergency/${id}`);
//       setContacts(contacts.filter(c => c.id !== id));
//     } catch (err) {
//       setError('Failed to delete contact');
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add Contact
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {showForm && (
//         <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">New Emergency Contact</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label htmlFor="relation" className="block text-sm font-medium text-gray-700">
//                 Relation
//               </label>
//               <input
//                 type="text"
//                 name="relation"
//                 id="relation"
//                 required
//                 value={formData.relation}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="e.g., Spouse, Brother, Friend"
//               />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 id="phone"
//                 required
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => setShowForm(false)}
//                 className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
//               >
//                 {submitting ? 'Saving...' : 'Save Contact'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {contacts.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-gray-500">No emergency contacts added yet.</p>
//         </div>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {contacts.map((contact) => (
//               <li key={contact.id} className="px-4 py-4 sm:px-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
//                     <div className="ml-3">
//                       <p className="text-sm font-medium text-gray-900">{contact.name}</p>
//                       <p className="text-sm text-gray-500">{contact.relation}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <a href={`tel:${contact.phone}`} className="flex items-center text-indigo-600 hover:text-indigo-500">
//                       <PhoneIcon className="h-5 w-5" />
//                     </a>
//                     <button
//                       onClick={() => handleDelete(contact.id)}
//                       className="text-red-600 hover:text-red-500"
//                     >
//                       <TrashIcon className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmergencyContacts;





import { useState, useEffect } from 'react';
import { PlusIcon, PhoneIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createEmergencyContact, deleteEmergencyContact, getEmergencyContacts } from '../services/emergency';
import hypertensionImg from '../assets/hypertension.jpg';
import crampsImg from '../assets/cramps.jpg';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', relation: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await getEmergencyContacts();
      setContacts(response.data);
    } catch (err) {
      setError('Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await createEmergencyContact(formData);
      setContacts([...contacts, response.data]);
      setShowForm(false);
      setFormData({ name: '', relation: '', phone: '' });
    } catch (err) {
      setError('Failed to add contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteEmergencyContact(id);
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Contact
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative rounded-xl overflow-hidden min-h-40">
          <img src={hypertensionImg} alt="Emergency preparedness" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 p-4 flex items-end">
            <p className="text-white font-semibold text-sm sm:text-base">
              Keep at least one trusted person reachable at all times.
            </p>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden min-h-40">
          <img src={crampsImg} alt="Medical support contact" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 p-4 flex items-end">
            <p className="text-white font-semibold text-sm sm:text-base">
              Save numbers you can call immediately during urgent symptoms.
            </p>
          </div>
        </div>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">New Emergency Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              name="relation"
              placeholder="Relation"
              required
              value={formData.relation}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Contact'}
              </button>
            </div>
          </form>
        </div>
      )}
      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No emergency contacts added yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <li key={contact.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.relation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href={`tel:${contact.phone}`} className="flex items-center text-indigo-600 hover:text-indigo-500">
                      <PhoneIcon className="h-5 w-5" />
                    </a>
                    <button onClick={() => handleDelete(contact.id)} className="text-red-600 hover:text-red-500">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
