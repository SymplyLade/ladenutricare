// import React, { useState, useEffect } from 'react';
// import { Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { logActivity } from '../utils/logActivity';

// const departments = [
//     { label: 'General Medicine', doctors: ['Dr. Solution', 'Dr. Roi'] },
//     { label: 'Cardiology', doctors: ['Dr. Adebisi', 'Dr. Omodolapo'] },
//     { label: 'Neurology', doctors: ['Dr. Michael Lee', 'Dr. Fatima Bello'] },
//     { label: 'Pediatrics', doctors: ['Dr. Grace Addo', 'Dr. Opeyemi'] },
// ];

// const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

// const AppointmentBooking = () => {
//     const navigate = useNavigate();

//     const [department, setDepartment] = useState(departments[0].label);
//     const [doctor, setDoctor] = useState(departments[0].doctors[0]);
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState('');
//     const [recommendedFrom, setRecommendedFrom] = useState('');

//     // Auto-select department recommended from SymptomChecker
//     useEffect(() => {
//         const recommended = localStorage.getItem('recommendedDepartment');
//         if (recommended) {
//             const dept = departments.find(d => d.label === recommended);
//             if (dept) {
//                 setDepartment(dept.label);
//                 setDoctor(dept.doctors[0]);
//                 setRecommendedFrom(recommended);
//             }
//             localStorage.removeItem('recommendedDepartment');
//         }
//     }, []);

//     const selectedDept = departments.find(d => d.label === department);

//     const handleDepartmentChange = (e) => {
//         const dept = departments.find(d => d.label === e.target.value);
//         setDepartment(dept.label);
//         setDoctor(dept.doctors[0]);
//         setRecommendedFrom('');
//     };

//     const handleConfirm = () => {
//         if (!date || !time) {
//             setError('Please select a date and time slot.');
//             return;
//         }

//         const newAppointment = { doctor, department, date, time };

//         const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
//         localStorage.setItem('appointments', JSON.stringify([...existing, newAppointment]));

//         logActivity('appointments', `Booked appointment with ${doctor} (${department}) on ${date} at ${time}`);

//         setSuccess(true);
//         setError('');

//         setTimeout(() => {
//             setSuccess(false);
//             navigate('/');
//         }, 2000);
//     };

//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
//                 <Calendar size={24} />
//                 <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Book Appointment</h2>
//             </div>

//             {/* Recommended Banner */}
//             {recommendedFrom && (
//                 <div style={{
//                     marginBottom: '1rem', padding: '0.75rem 1rem',
//                     backgroundColor: '#f0fdf4', borderRadius: '0.75rem',
//                     border: '1px solid #bbf7d0', display: 'flex',
//                     alignItems: 'center', gap: '0.5rem'
//                 }}>
//                     <span style={{ fontSize: '1rem' }}>🩺</span>
//                     <p style={{ fontSize: '0.85rem', color: '#16a34a' }}>
//                         Based on your symptoms, we recommend <strong>{recommendedFrom}</strong>. Department pre-selected for you.
//                     </p>
//                 </div>
//             )}

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

//                 {/* Department */}
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Select Department
//                     </label>
//                     <select
//                         value={department}
//                         onChange={handleDepartmentChange}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
//                     >
//                         {departments.map(d => (
//                             <option key={d.label} value={d.label}>{d.label}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Doctor */}
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Select Doctor
//                     </label>
//                     <select
//                         value={doctor}
//                         onChange={e => setDoctor(e.target.value)}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
//                     >
//                         {selectedDept.doctors.map(doc => (
//                             <option key={doc} value={doc}>{doc}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Date */}
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Preferred Date
//                     </label>
//                     <input
//                         type="date"
//                         value={date}
//                         onChange={e => setDate(e.target.value)}
//                         min={new Date().toISOString().split('T')[0]}
//                         style={{ width: '100%' }}
//                     />
//                 </div>

//                 {/* Time Slots */}
//                 <div style={{ marginTop: '0.5rem' }}>
//                     <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
//                         Available Slots
//                     </h4>
//                     <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//                         {timeSlots.map(slot => (
//                             <span
//                                 key={slot}
//                                 onClick={() => setTime(slot)}
//                                 style={{
//                                     padding: '0.4rem 0.8rem', borderRadius: '2rem',
//                                     fontSize: '0.85rem', cursor: 'pointer',
//                                     border: `1px solid ${time === slot ? 'var(--color-primary)' : '#cbd5e1'}`,
//                                     color: time === slot ? 'var(--color-primary)' : 'var(--color-text-muted)',
//                                     backgroundColor: time === slot ? '#f0fdf4' : 'white',
//                                     transition: 'all 0.2s'
//                                 }}
//                             >
//                                 {slot}
//                             </span>
//                         ))}
//                     </div>
//                 </div>

//                 {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

//                 {success && (
//                     <div style={{
//                         padding: '0.75rem 1rem', backgroundColor: '#f0fdf4',
//                         borderRadius: '0.75rem', border: '1px solid #bbf7d0',
//                         display: 'flex', alignItems: 'center', gap: '0.5rem'
//                     }}>
//                         <span>✅</span>
//                         <p style={{ fontSize: '0.85rem', color: '#16a34a' }}>
//                             Appointment booked with <strong>{doctor}</strong> on <strong>{date}</strong> at <strong>{time}</strong>. Redirecting...
//                         </p>
//                     </div>
//                 )}

//                 <button onClick={handleConfirm} style={{ marginTop: '1rem', width: '100%' }}>
//                     Confirm Booking
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AppointmentBooking;





// import React, { useState, useEffect } from 'react';
// import { Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { logActivity } from '../utils/logActivity';

// const departments = [
//     { label: 'General Medicine', doctors: ['Dr. Solution', 'Dr. Roi'] },
//     { label: 'Cardiology', doctors: ['Dr. Adebisi', 'Dr. Omodolapo'] },
//     { label: 'Neurology', doctors: ['Dr. Michael Lee', 'Dr. Fatima Bello'] },
//     { label: 'Pediatrics', doctors: ['Dr. Grace Addo', 'Dr. Opeyemi'] },
// ];

// const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

// const AppointmentBooking = () => {
//     const navigate = useNavigate();

//     const [department, setDepartment] = useState(departments[0].label);
//     const [doctor, setDoctor] = useState(departments[0].doctors[0]);
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState('');
//     const [recommendedFrom, setRecommendedFrom] = useState('');

//     // Auto-select department recommended from SymptomChecker
//     useEffect(() => {
//         const recommended = localStorage.getItem('recommendedDepartment');
//         if (recommended) {
//             const dept = departments.find(d => d.label === recommended);
//             if (dept) {
//                 setDepartment(dept.label);
//                 setDoctor(dept.doctors[0]);
//                 setRecommendedFrom(recommended);
//             }
//             localStorage.removeItem('recommendedDepartment');
//         }
//     }, []);

//     const selectedDept = departments.find(d => d.label === department);

//     const handleDepartmentChange = (e) => {
//         const dept = departments.find(d => d.label === e.target.value);
//         setDepartment(dept.label);
//         setDoctor(dept.doctors[0]);
//         setRecommendedFrom('');
//     };

//     const handleConfirm = () => {
//         if (!date || !time) {
//             setError('Please select a date and time slot.');
//             return;
//         }

//         const newAppointment = {
//             id: Date.now(), // unique id
//             doctor,
//             department,
//             date,
//             time,
//             status: 'pending', // send to admin first
//             userName: 'Current User', // replace with actual user from context
//         };

//         // Store pending actions in localStorage (admin dashboard will read these)
//         const pending = JSON.parse(localStorage.getItem('pendingActions') || '[]');
//         localStorage.setItem('pendingActions', JSON.stringify([...pending, newAppointment]));

//         logActivity('appointments', `Requested appointment with ${doctor} (${department}) on ${date} at ${time}`);

//         setSuccess(true);
//         setError('');

//         setTimeout(() => {
//             setSuccess(false);
//             navigate('/'); // redirect after request
//         }, 2000);
//     };

//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
//                 <Calendar size={24} />
//                 <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Book Appointment</h2>
//             </div>

//             {recommendedFrom && (
//                 <div style={{
//                     marginBottom: '1rem', padding: '0.75rem 1rem',
//                     backgroundColor: '#f0fdf4', borderRadius: '0.75rem',
//                     border: '1px solid #bbf7d0', display: 'flex',
//                     alignItems: 'center', gap: '0.5rem'
//                 }}>
//                     <span style={{ fontSize: '1rem' }}>🩺</span>
//                     <p style={{ fontSize: '0.85rem', color: '#16a34a' }}>
//                         Based on your symptoms, we recommend <strong>{recommendedFrom}</strong>. Department pre-selected for you.
//                     </p>
//                 </div>
//             )}

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 {/* Department */}
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Select Department
//                     </label>
//                     <select
//                         value={department}
//                         onChange={handleDepartmentChange}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
//                     >
//                         {departments.map(d => (
//                             <option key={d.label} value={d.label}>{d.label}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Doctor */}
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Select Doctor
//                     </label>
//                     <select
//                         value={doctor}
//                         onChange={e => setDoctor(e.target.value)}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
//                     >
//                         {selectedDept.doctors.map(doc => (
//                             <option key={doc} value={doc}>{doc}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Date */}
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Preferred Date
//                     </label>
//                     <input
//                         type="date"
//                         value={date}
//                         onChange={e => setDate(e.target.value)}
//                         min={new Date().toISOString().split('T')[0]}
//                         style={{ width: '100%' }}
//                     />
//                 </div>

//                 {/* Time Slots */}
//                 <div style={{ marginTop: '0.5rem' }}>
//                     <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Available Slots</h4>
//                     <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//                         {timeSlots.map(slot => (
//                             <span
//                                 key={slot}
//                                 onClick={() => setTime(slot)}
//                                 style={{
//                                     padding: '0.4rem 0.8rem',
//                                     borderRadius: '2rem',
//                                     fontSize: '0.85rem',
//                                     cursor: 'pointer',
//                                     border: `1px solid ${time === slot ? 'var(--color-primary)' : '#cbd5e1'}`,
//                                     color: time === slot ? 'var(--color-primary)' : 'var(--color-text-muted)',
//                                     backgroundColor: time === slot ? '#f0fdf4' : 'white',
//                                     transition: 'all 0.2s'
//                                 }}
//                             >
//                                 {slot}
//                             </span>
//                         ))}
//                     </div>
//                 </div>

//                 {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

//                 {success && (
//                     <div style={{
//                         padding: '0.75rem 1rem', backgroundColor: '#f0fdf4',
//                         borderRadius: '0.75rem', border: '1px solid #bbf7d0',
//                         display: 'flex', alignItems: 'center', gap: '0.5rem'
//                     }}>
//                         <span>✅</span>
//                         <p style={{ fontSize: '0.85rem', color: '#16a34a' }}>
//                             Appointment request sent for approval. Admin will confirm your booking.
//                         </p>
//                     </div>
//                 )}

//                 <button onClick={handleConfirm} style={{ marginTop: '1rem', width: '100%' }}>
//                     Request Appointment
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AppointmentBooking;




import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../utils/logActivity';

const departments = [
  { label: 'General Medicine', doctors: ['Dr. Solution', 'Dr. Roi'] },
  { label: 'Cardiology', doctors: ['Dr. Adebisi', 'Dr. Omodolapo'] },
  { label: 'Neurology', doctors: ['Dr. Michael Lee', 'Dr. Fatima Bello'] },
  { label: 'Pediatrics', doctors: ['Dr. Grace Addo', 'Dr. Opeyemi'] },
];

const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

const AppointmentBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(departments[0].label);
  const [doctor, setDoctor] = useState(departments[0].doctors[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [recommendedFrom, setRecommendedFrom] = useState('');

  useEffect(() => {
    const recommended = localStorage.getItem('recommendedDepartment');
    if (recommended) {
      const dept = departments.find(d => d.label === recommended);
      if (dept) {
        setDepartment(dept.label);
        setDoctor(dept.doctors[0]);
        setRecommendedFrom(recommended);
      }
      localStorage.removeItem('recommendedDepartment');
    }
  }, []);

  const selectedDept = departments.find(d => d.label === department);

  const handleDepartmentChange = (e) => {
    const dept = departments.find(d => d.label === e.target.value);
    setDepartment(dept.label);
    setDoctor(dept.doctors[0]);
    setRecommendedFrom('');
  };

  const handleRequest = () => {
    if (!date || !time) {
      setError('Please select a date and time slot.');
      return;
    }

    const newRequest = {
      id: Date.now(),
      user: user.name,
      doctor,
      department,
      date,
      time,
      status: 'pending', // pending approval
    };

    const existing = JSON.parse(localStorage.getItem('appointmentRequests') || '[]');
    localStorage.setItem('appointmentRequests', JSON.stringify([...existing, newRequest]));

    logActivity('appointments', `Requested appointment with ${doctor} on ${date} at ${time}`);

    setSuccess(true);
    setError('');

    setTimeout(() => {
      setSuccess(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--color-primary)' }}>
        <Calendar size={24} />
        <h2 style={{ marginLeft: '0.5rem', fontWeight: 600 }}>Request Appointment</h2>
      </div>

      {recommendedFrom && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
          Based on your symptoms, we recommend <strong>{recommendedFrom}</strong>.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Department</label>
          <select value={department} onChange={handleDepartmentChange} style={{ width: '100%', padding: '0.5rem' }}>
            {departments.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label>Doctor</label>
          <select value={doctor} onChange={e => setDoctor(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            {selectedDept.doctors.map(doc => <option key={doc} value={doc}>{doc}</option>)}
          </select>
        </div>

        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ width: '100%' }} />
        </div>

        <div>
          <label>Time Slot</label>
          <select value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">Select time</option>
            {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Appointment request sent for admin approval!</p>}

        <button onClick={handleRequest} style={{ padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default AppointmentBooking;