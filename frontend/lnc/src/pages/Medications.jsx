// import { useState, useEffect } from 'react';
// import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
// import api from '../services/api';

// const Medications = () => {
//   const [medications, setMedications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     dosage: '',
//     frequency: '',
//     time_slots: [''],
//     notes: '',
//   });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchMedications();
//   }, []);

//   const fetchMedications = async () => {
//     try {
//       const response = await api.get('/medications');
//       setMedications(response.data);
//     } catch (err) {
//       setError('Failed to load medications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleTimeSlotChange = (index, value) => {
//     const newSlots = [...formData.time_slots];
//     newSlots[index] = value;
//     setFormData({ ...formData, time_slots: newSlots });
//   };

//   const addTimeSlot = () => {
//     setFormData({ ...formData, time_slots: [...formData.time_slots, ''] });
//   };

//   const removeTimeSlot = (index) => {
//     if (formData.time_slots.length > 1) {
//       const newSlots = formData.time_slots.filter((_, i) => i !== index);
//       setFormData({ ...formData, time_slots: newSlots });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await api.post('/medications', formData);
//       setMedications([...medications, response.data]);
//       setShowForm(false);
//       setFormData({ name: '', dosage: '', frequency: '', time_slots: [''], notes: '' });
//     } catch (err) {
//       setError('Failed to add medication');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleToggleTaken = async (id, currentStatus) => {
//     try {
//       await api.put(`/medications/${id}`, { taken_today: !currentStatus });
//       setMedications(medications.map(med =>
//         med.id === id ? { ...med, taken_today: !currentStatus } : med
//       ));
//     } catch (err) {
//       setError('Failed to update status');
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Medication Tracker</h1>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add Medication
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {showForm && (
//         <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Medication</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Medication Name *
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
//               <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
//                 Dosage *
//               </label>
//               <input
//                 type="text"
//                 name="dosage"
//                 id="dosage"
//                 required
//                 value={formData.dosage}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="e.g., 10mg, 1 tablet"
//               />
//             </div>

//             <div>
//               <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
//                 Frequency *
//               </label>
//               <input
//                 type="text"
//                 name="frequency"
//                 id="frequency"
//                 required
//                 value={formData.frequency}
//                 onChange={handleChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="e.g., Twice daily"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Time Slots
//               </label>
//               {formData.time_slots.map((slot, index) => (
//                 <div key={index} className="flex items-center space-x-2 mb-2">
//                   <input
//                     type="time"
//                     value={slot}
//                     onChange={(e) => handleTimeSlotChange(index, e.target.value)}
//                     className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   />
//                   {formData.time_slots.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeTimeSlot(index)}
//                       className="text-red-600 hover:text-red-500"
//                     >
//                       <XCircleIcon className="h-5 w-5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addTimeSlot}
//                 className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
//               >
//                 + Add another time
//               </button>
//             </div>

//             <div>
//               <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//                 Notes
//               </label>
//               <textarea
//                 name="notes"
//                 id="notes"
//                 rows={2}
//                 value={formData.notes}
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
//                 {submitting ? 'Saving...' : 'Save Medication'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {medications.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-gray-500">No medications added yet.</p>
//         </div>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {medications.map((med) => (
//               <li key={med.id} className="px-4 py-4 sm:px-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-medium text-gray-900">{med.name}</h3>
//                     <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
//                     {med.time_slots && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         Times: {med.time_slots.join(', ')}
//                       </p>
//                     )}
//                     {med.notes && (
//                       <p className="text-sm text-gray-500 mt-1">Note: {med.notes}</p>
//                     )}
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <button
//                       onClick={() => handleToggleTaken(med.id, med.taken_today)}
//                       className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                         med.taken_today
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       <CheckCircleIcon className="h-5 w-5 mr-1" />
//                       {med.taken_today ? 'Taken' : 'Mark as taken'}
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

// export default Medications;




import { useState, useEffect } from 'react';
import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { createMedication, getMedications, updateMedication } from '../services/medications';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time_slots: [''],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await getMedications();
      setMedications(response.data);
    } catch (err) {
      setError('Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSlotChange = (index, value) => {
    const newSlots = [...formData.time_slots];
    newSlots[index] = value;
    setFormData({ ...formData, time_slots: newSlots });
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, time_slots: [...formData.time_slots, ''] });
  };

  const removeTimeSlot = (index) => {
    if (formData.time_slots.length > 1) {
      setFormData({ ...formData, time_slots: formData.time_slots.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await createMedication(formData);
      setMedications([...medications, response.data]);
      setShowForm(false);
      setFormData({ name: '', dosage: '', frequency: '', time_slots: [''], notes: '' });
    } catch (err) {
      setError('Failed to add medication');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTaken = async (id, currentStatus) => {
    try {
      await updateMedication(id, { taken_today: !currentStatus });
      setMedications(medications.map(med =>
        med.id === id ? { ...med, taken_today: !currentStatus } : med
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medication Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Medication
        </button>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Medication</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Medication Name *"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              name="dosage"
              placeholder="Dosage * (e.g., 10mg)"
              required
              value={formData.dosage}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              name="frequency"
              placeholder="Frequency * (e.g., Twice daily)"
              required
              value={formData.frequency}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
              {formData.time_slots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="time"
                    value={slot}
                    onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {formData.time_slots.length > 1 && (
                    <button type="button" onClick={() => removeTimeSlot(index)} className="text-red-600 hover:text-red-500">
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTimeSlot} className="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
                + Add another time
              </button>
            </div>
            <textarea
              name="notes"
              placeholder="Notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? 'Saving...' : 'Save Medication'}
              </button>
            </div>
          </form>
        </div>
      )}
      {medications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No medications added yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {medications.map((med) => (
              <li key={med.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                    {med.time_slots && <p className="text-sm text-gray-500 mt-1">Times: {med.time_slots.join(', ')}</p>}
                    {med.notes && <p className="text-sm text-gray-500 mt-1">Note: {med.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleToggleTaken(med.id, med.taken_today)}
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      med.taken_today ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    {med.taken_today ? 'Taken' : 'Mark as taken'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Medications;
