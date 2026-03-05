// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getAppointments } from '../services/appointments';
// import { CalendarIcon, ClockIcon, UserIcon, CreditCardIcon } from '@heroicons/react/24/outline';

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const response = await getAppointments();
//       setAppointments(response.data);
//     } catch (err) {
//       setError('Failed to load appointments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
//         <Link
//           to="/appointments/new"
//           className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
//         >
//           <CalendarIcon className="h-5 w-5 mr-2" />
//           Book New Appointment
//         </Link>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {appointments.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-gray-500">No appointments found.</p>
//           <Link
//             to="/appointments/new"
//             className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
//           >
//             Book your first appointment
//           </Link>
//         </div>
//       ) : (
//         <div className="bg-white shadow overflow-hidden sm:rounded-md">
//           <ul className="divide-y divide-gray-200">
//             {appointments.map((apt) => (
//               <li key={apt.id}>
//                 <Link to={`/appointments/${apt.id}`} className="block hover:bg-gray-50">
//                   <div className="px-4 py-4 sm:px-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
//                         <p className="text-sm font-medium text-indigo-600 truncate">
//                           {apt.department} - Dr. {apt.doctor_name}
//                         </p>
//                         <div className="ml-2 flex-shrink-0 flex">
//                           <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(apt.status)}`}>
//                             {apt.status}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center">
//                         <CreditCardIcon className="h-5 w-5 text-gray-400 mr-1" />
//                         <p className="text-sm text-gray-500">
//                           &#8358;{apt.consultation_fee}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="mt-2 sm:flex sm:justify-between">
//                       <div className="sm:flex">
//                         <p className="flex items-center text-sm text-gray-500">
//                           <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
//                           {new Date(apt.appointment_date).toLocaleDateString()}
//                         </p>
//                         <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
//                           <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
//                           {apt.appointment_time}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Appointments;





import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../services/appointments';
import { CalendarIcon, ClockIcon, UserIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  
  const statusLabel = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'completed') return 'Doctor Seen ✓';
    return normalized || 'pending';
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <Link
          to="/appointments/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          Book New Appointment
        </Link>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No appointments found.</p>
          <Link to="/appointments/new" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {appointments.map((apt) => (
              <li key={apt.id}>
                <Link to={`/appointments/${apt.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {apt.department} - Dr. {apt.doctor_name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                            {statusLabel(apt.status)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">&#8358;{apt.consultation_fee}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
                          {new Date(apt.appointment_date).toLocaleDateString()}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
                          {apt.appointment_time}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Appointments;


