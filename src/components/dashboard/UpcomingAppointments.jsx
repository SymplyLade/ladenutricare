// import React from 'react';
// import { Calendar, Clock } from 'lucide-react';

// const appointments = [
//     { doctor: 'Dr. Sarah Johnson', department: 'Cardiology', date: 'Feb 28, 2026', time: '10:00 AM' },
//     { doctor: 'Dr. Michael Lee', department: 'General Medicine', date: 'Mar 5, 2026', time: '02:30 PM' },
// ];

// const UpcomingAppointments = () => {
//     return (
//         <div className="card">
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
//                 <Calendar size={22} />
//                 <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Upcoming Appointments</h3>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 {appointments.map((apt, index) => (
//                     <div key={index} style={{
//                         padding: '1rem', backgroundColor: '#f8fafc',
//                         borderRadius: '0.75rem', borderLeft: '4px solid var(--color-primary)'
//                     }}>
//                         <p style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{apt.doctor}</p>
//                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{apt.department}</p>
//                         <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
//                             <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
//                                 <Calendar size={13} /> {apt.date}
//                             </span>
//                             <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
//                                 <Clock size={13} /> {apt.time}
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default UpcomingAppointments;


import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('appointments') || '[]');
        setAppointments(stored);
    }, []);

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                <Calendar size={22} />
                <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Upcoming Appointments</h3>
            </div>

            {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <Calendar size={40} style={{ color: '#cbd5e1', marginBottom: '0.75rem' }} />
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        You have no upcoming appointments.
                    </p>
                    <button
                        onClick={() => navigate('/appointments')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                        Book an Appointment
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.map((apt, index) => (
                        <div key={index} style={{
                            padding: '1rem', backgroundColor: '#f8fafc',
                            borderRadius: '0.75rem', borderLeft: '4px solid var(--color-primary)'
                        }}>
                            <p style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{apt.doctor}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{apt.department}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Calendar size={13} /> {apt.date}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Clock size={13} /> {apt.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingAppointments;