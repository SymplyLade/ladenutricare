// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { getAppointment, cancelAppointment } from '../services/appointments';
// import { CalendarIcon, ClockIcon, UserIcon, CreditCardIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

// const AppointmentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [appointment, setAppointment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [cancelling, setCancelling] = useState(false);

//   useEffect(() => {
//     fetchAppointment();
//   }, [id]);

//   const fetchAppointment = async () => {
//     try {
//       const response = await getAppointment(id);
//       setAppointment(response.data);
//     } catch (err) {
//       setError('Failed to load appointment details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
//     setCancelling(true);
//     try {
//       await cancelAppointment(id);
//       navigate('/appointments');
//     } catch (err) {
//       setError('Failed to cancel appointment');
//       setCancelling(false);
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
//   if (!appointment) return <div className="text-center py-10">Appointment not found</div>;

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="mb-6">
//         <Link to="/appointments" className="text-indigo-600 hover:text-indigo-500">
//           â† Back to Appointments
//         </Link>
//       </div>

//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Details</h3>
//           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
//             {appointment.status}
//           </span>
//         </div>
//         <div className="border-t border-gray-200">
//           <dl>
//             <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//               <dt className="text-sm font-medium text-gray-500 flex items-center">
//                 <UserIcon className="h-5 w-5 mr-2" /> Department
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                 {appointment.department}
//               </dd>
//             </div>
//             <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//               <dt className="text-sm font-medium text-gray-500">Doctor</dt>
//               <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                 Dr. {appointment.doctor_name}
//               </dd>
//             </div>
//             <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//               <dt className="text-sm font-medium text-gray-500 flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" /> Date
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                 {new Date(appointment.appointment_date).toLocaleDateString()}
//               </dd>
//             </div>
//             <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//               <dt className="text-sm font-medium text-gray-500 flex items-center">
//                 <ClockIcon className="h-5 w-5 mr-2" /> Time
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                 {appointment.appointment_time}
//               </dd>
//             </div>
//             <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//               <dt className="text-sm font-medium text-gray-500 flex items-center">
//                 <CreditCardIcon className="h-5 w-5 mr-2" /> Consultation Fee
//               </dt>
//               <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                 &#8358;{appointment.consultation_fee}
//               </dd>
//             </div>
//             {appointment.video_link && (
//               <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                 <dt className="text-sm font-medium text-gray-500 flex items-center">
//                   <VideoCameraIcon className="h-5 w-5 mr-2" /> Video Link
//                 </dt>
//                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                   <a href={appointment.video_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
//                     Join Consultation
//                   </a>
//                 </dd>
//               </div>
//             )}
//             {appointment.notes && (
//               <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//                 <dt className="text-sm font-medium text-gray-500">Notes</dt>
//                 <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
//                   {appointment.notes}
//                 </dd>
//               </div>
//             )}
//           </dl>
//         </div>
//       </div>

//       {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={handleCancel}
//             disabled={cancelling}
//             className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
//           >
//             {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppointmentDetail;




import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cancelAppointment, deleteAppointment, getAppointment, markAppointmentSeen } from '../services/appointments';
import { CalendarIcon, ClockIcon, UserIcon, CreditCardIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { generateVideoLink } from '../services/videoConsultation';
import { completePayment, initializePayment } from '../services/payments';
import { completeDoctorTask, documentConsultation, getConsultationDocuments } from '../services/consultations';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    card_holder: '',
    card_number: '',
    expiry: '',
    cvv: '',
    phone_number: '',
  });
  const [markingSeen, setMarkingSeen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [consultationDocs, setConsultationDocs] = useState({ notes: [], tasks: [] });
  const [docsLoading, setDocsLoading] = useState(false);
  const [savingDocs, setSavingDocs] = useState(false);
  const [docForm, setDocForm] = useState({
    summary: '',
    tasks: [{ task_text: '', reminder_time: '08:00', is_daily: true }],
  });

  useEffect(() => {
    fetchAppointment();
    fetchConsultationDocs();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await getAppointment(id);
      setAppointment(response.data);
    } catch (err) {
      setError('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(true);
    try {
      await cancelAppointment(id);
      navigate('/appointments');
    } catch (err) {
      setError('Failed to cancel appointment');
      setCancelling(false);
    }
  };

  const fetchConsultationDocs = async () => {
    setDocsLoading(true);
    try {
      const response = await getConsultationDocuments(id);
      setConsultationDocs(response.data || { notes: [], tasks: [] });
    } catch {
      setConsultationDocs({ notes: [], tasks: [] });
    } finally {
      setDocsLoading(false);
    }
  };

  const handleGenerateVideoLink = async () => {
    setVideoLoading(true);
    setError('');
    try {
      const response = await generateVideoLink(id);
      setAppointment((prev) => ({ ...prev, video_link: response.data.video_link }));
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to generate video consultation link');
    } finally {
      setVideoLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method (e.g., Mastercard) before paying.');
      return;
    }
    setPaymentLoading(true);
    setPaymentMessage('');
    setError('');
    try {
      const details = {};
      if (paymentMethod === 'bank_transfer') {
        details.bank_name = paymentDetails.bank_name;
        details.account_name = paymentDetails.account_name;
        details.account_number = paymentDetails.account_number;
      } else if (paymentMethod === 'ussd') {
        details.bank_name = paymentDetails.bank_name;
        details.phone_number = paymentDetails.phone_number;
      } else if (['mastercard', 'visa', 'verve'].includes(paymentMethod)) {
        details.card_holder = paymentDetails.card_holder;
        details.card_number = paymentDetails.card_number;
        details.expiry = paymentDetails.expiry;
        details.cvv = paymentDetails.cvv;
      }

      const init = await initializePayment({
        appointment_id: Number(id),
        payment_method: paymentMethod,
        payment_details: details,
      });
      const paymentId = init.data?.payment_id;
      if (!paymentId) {
        throw new Error('Failed to initialize payment');
      }
      await completePayment(paymentId, { transaction_id: init.data?.transaction_id });
      setPaymentMessage(`Payment successful via ${paymentMethod}. Appointment payment status updated.`);
      await fetchAppointment();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!window.confirm('Delete this appointment permanently? This cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      await deleteAppointment(id);
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete appointment');
      setDeleting(false);
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

  const handleMarkSeen = async () => {
    setMarkingSeen(true);
    setError('');
    try {
      await markAppointmentSeen(id);
      await fetchAppointment();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark appointment as seen');
    } finally {
      setMarkingSeen(false);
    }
  };

  const updateTaskRow = (index, field, value) => {
    setDocForm((prev) => {
      const nextTasks = [...prev.tasks];
      nextTasks[index] = { ...nextTasks[index], [field]: value };
      return { ...prev, tasks: nextTasks };
    });
  };

  const addTaskRow = () => {
    setDocForm((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { task_text: '', reminder_time: '08:00', is_daily: true }],
    }));
  };

  const removeTaskRow = (index) => {
    setDocForm((prev) => {
      const nextTasks = prev.tasks.filter((_, i) => i !== index);
      return { ...prev, tasks: nextTasks.length ? nextTasks : [{ task_text: '', reminder_time: '08:00', is_daily: true }] };
    });
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    setSavingDocs(true);
    setError('');
    try {
      const tasks = docForm.tasks
        .map((t) => ({
          task_text: String(t.task_text || '').trim(),
          reminder_time: String(t.reminder_time || '').trim(),
          is_daily: Boolean(t.is_daily),
        }))
        .filter((t) => t.task_text.length > 0);
      await documentConsultation(id, {
        summary: docForm.summary.trim(),
        tasks,
      });
      setDocForm({
        summary: '',
        tasks: [{ task_text: '', reminder_time: '08:00', is_daily: true }],
      });
      await fetchConsultationDocs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save consultation documentation');
    } finally {
      setSavingDocs(false);
    }
  };

  const toggleTaskDone = async (taskId, current) => {
    try {
      await completeDoctorTask(taskId, !current);
      await fetchConsultationDocs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update task');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!appointment) return <div className="text-center py-10">Appointment not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/appointments" className="text-indigo-600 hover:text-indigo-500">
          Back to Appointments
        </Link>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Details</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
            {statusLabel(appointment.status)}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" /> Department
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.department}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Doctor</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Dr. {appointment.doctor_name}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" /> Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" /> Time
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.appointment_time}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" /> Consultation Fee
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">&#8358;{appointment.consultation_fee}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2" /> Payment Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {String(appointment.payment_status || '').split('.').pop().toLowerCase() || 'pending'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <VideoCameraIcon className="h-5 w-5 mr-2" /> Video Consultation
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {appointment.video_link ? (
                  <a
                    href={appointment.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Join Consultation
                  </a>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600">No video link generated yet.</p>
                    {appointment.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={handleGenerateVideoLink}
                        disabled={videoLoading}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {videoLoading ? 'Generating...' : 'Generate Video Link'}
                      </button>
                    )}
                  </div>
                )}
              </dd>
            </div>
            {appointment.notes && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{appointment.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Conversation and Daily Plan</h3>
        <form onSubmit={handleSaveConsultation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conversation Summary</label>
            <textarea
              value={docForm.summary}
              onChange={(e) => setDocForm((prev) => ({ ...prev, summary: e.target.value }))}
              rows={4}
              required
              placeholder="Write what the doctor said, diagnosis, and key advice..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Tasks and Reminder Time</label>
            <div className="space-y-2">
              {docForm.tasks.map((task, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={task.task_text}
                    onChange={(e) => updateTaskRow(idx, 'task_text', e.target.value)}
                    placeholder="e.g., Take Metformin after breakfast"
                    className="sm:col-span-7 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="time"
                    value={task.reminder_time}
                    onChange={(e) => updateTaskRow(idx, 'reminder_time', e.target.value)}
                    className="sm:col-span-3 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeTaskRow(idx)}
                    className="sm:col-span-2 bg-gray-100 text-gray-700 rounded-md px-3 py-2 text-sm hover:bg-gray-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTaskRow}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              + Add task
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingDocs}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {savingDocs ? 'Saving...' : 'Save Conversation and Tasks'}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Saved Notes</h4>
          {docsLoading ? (
            <p className="text-sm text-gray-500">Loading notes...</p>
          ) : consultationDocs.notes?.length ? (
            <ul className="space-y-2">
              {consultationDocs.notes.map((note) => (
                <li key={note.id} className="text-sm text-gray-700 bg-gray-50 rounded-md p-3 border border-gray-200">
                  {note.summary}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No conversation note saved yet.</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Daily Tasks</h4>
          {consultationDocs.tasks?.length ? (
            <ul className="space-y-2">
              {consultationDocs.tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-md p-3 border border-gray-200">
                  <div>
                    <p className={`text-sm ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.task_text}
                    </p>
                    <p className="text-xs text-gray-500">Reminder: {task.reminder_time} {task.is_daily ? '(Daily)' : ''}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTaskDone(task.id, task.is_completed)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      task.is_completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {task.is_completed ? 'Completed ✓' : 'Mark Done'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No task saved yet.</p>
          )}
        </div>
      </div>
      {paymentMessage && (
        <div className="mt-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800">
          {paymentMessage}
        </div>
      )}
      {String(appointment.payment_status || '').split('.').pop().toLowerCase() !== 'completed' &&
        appointment.status !== 'cancelled' && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-3">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentDetails({
                    bank_name: '',
                    account_name: '',
                    account_number: '',
                    card_holder: '',
                    card_number: '',
                    expiry: '',
                    cvv: '',
                    phone_number: '',
                  });
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select method</option>
                <option value="mastercard">Mastercard</option>
                <option value="visa">Visa</option>
                <option value="verve">Verve</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="ussd">USSD</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            {paymentMethod === 'bank_transfer' && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Bank name"
                  value={paymentDetails.bank_name}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, bank_name: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Account name"
                  value={paymentDetails.account_name}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, account_name: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Account number"
                  value={paymentDetails.account_number}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, account_number: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
            {paymentMethod === 'ussd' && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Bank name"
                  value={paymentDetails.bank_name}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, bank_name: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Phone number"
                  value={paymentDetails.phone_number}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, phone_number: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
            {['mastercard', 'visa', 'verve'].includes(paymentMethod) && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Card holder"
                  value={paymentDetails.card_holder}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, card_holder: e.target.value }))}
                  className="sm:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Card number"
                  value={paymentDetails.card_number}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, card_number: e.target.value }))}
                  className="sm:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentDetails.expiry}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, expiry: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails((p) => ({ ...p, cvv: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={paymentLoading || !paymentMethod}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {paymentLoading ? 'Processing Payment...' : 'Pay Online'}
            </button>
          </div>
        )}
      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleMarkSeen}
            disabled={markingSeen}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {markingSeen ? 'Updating...' : 'Mark as Doctor Seen ✓'}
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
          </button>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleDeleteAppointment}
          disabled={deleting}
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete Appointment'}
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetail;



