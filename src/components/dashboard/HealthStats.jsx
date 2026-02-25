// import React from 'react';
// import { Calendar, Activity, Clock, CheckCircle } from 'lucide-react';

// const stats = [
//     { label: 'Upcoming Appointments', value: '2', icon: <Calendar size={22} />, color: '#dcfce7', iconColor: '#16a34a' },
//     { label: 'Symptoms Logged', value: '5', icon: <Activity size={22} />, color: '#dbeafe', iconColor: '#2563eb' },
//     { label: 'Medications Tracked', value: '3', icon: <Clock size={22} />, color: '#fef9c3', iconColor: '#ca8a04' },
//     { label: 'Expiry Checks Done', value: '8', icon: <CheckCircle size={22} />, color: '#fce7f3', iconColor: '#db2777' },
// ];

// const HealthStats = () => {
//     return (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
//             {stats.map((stat, index) => (
//                 <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
//                     <div style={{
//                         padding: '0.75rem',
//                         backgroundColor: stat.color,
//                         borderRadius: '0.75rem',
//                         color: stat.iconColor,
//                         flexShrink: 0
//                     }}>
//                         {stat.icon}
//                     </div>
//                     <div>
//                         <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-text-main)', lineHeight: 1 }}>{stat.value}</p>
//                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{stat.label}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default HealthStats;


import React, { useEffect, useState } from 'react';
import { Calendar, Activity, Clock, CheckCircle } from 'lucide-react';

const HealthStats = () => {
    const [stats, setStats] = useState({
        appointments: 0,
        symptoms: 0,
        medications: 0,
        expiryChecks: 0,
    });

    useEffect(() => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const symptoms = JSON.parse(localStorage.getItem('symptoms') || '[]');
        const medications = JSON.parse(localStorage.getItem('medications') || '[]');
        const expiryChecks = JSON.parse(localStorage.getItem('expiryChecks') || '[]');

        setStats({
            appointments: appointments.length,
            symptoms: symptoms.length,
            medications: medications.length,
            expiryChecks: expiryChecks.length,
        });
    }, []);

    const statCards = [
        { label: 'Upcoming Appointments', value: stats.appointments, icon: <Calendar size={22} />, color: '#dcfce7', iconColor: '#16a34a' },
        { label: 'Symptoms Logged', value: stats.symptoms, icon: <Activity size={22} />, color: '#dbeafe', iconColor: '#2563eb' },
        { label: 'Medications Tracked', value: stats.medications, icon: <Clock size={22} />, color: '#fef9c3', iconColor: '#ca8a04' },
        { label: 'Expiry Checks Done', value: stats.expiryChecks, icon: <CheckCircle size={22} />, color: '#fce7f3', iconColor: '#db2777' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {statCards.map((stat, index) => (
                <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{
                        padding: '0.75rem', backgroundColor: stat.color,
                        borderRadius: '0.75rem', color: stat.iconColor, flexShrink: 0
                    }}>
                        {stat.icon}
                    </div>
                    <div>
                        <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-text-main)', lineHeight: 1 }}>{stat.value}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HealthStats;