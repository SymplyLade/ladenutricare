// import React from 'react';
// import { useAuth } from '../context/AuthContext';

// const Dashboard = () => {
//     const { user } = useAuth();

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
//             <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '1rem' }}>
//                 Welcome, {user?.name} 👋
//             </h1>
//             <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '500px', lineHeight: '1.7' }}>
//                 Your personal health assistant. Use the sidebar to check symptoms, verify medicine expiry dates, chat with MediBot, or book an appointment.
//             </p>
//         </div>
//     );
// };

// export default Dashboard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HealthStats from './dashboard/HealthStats';
import UpcomingAppointments from './dashboard/UpcomingAppointments';
import MedicationReminder from './dashboard/MedicationReminder';
import RecentActivity from './dashboard/RecentActivity';
import HealthTips from './dashboard/HealthTips';
import BMICalculator from './dashboard/BMICalculator';
import QuickActions from './dashboard/QuickActions';
import EmergencyContacts from './dashboard/EmergencyContacts';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-primary), #16a34a)',
                borderRadius: '1rem',
                padding: '2rem',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Welcome back, {user?.name} 👋
                </h1>
                <p style={{ opacity: 0.85, fontSize: '1rem' }}>
                    Here's your health overview for today.
                </p>
            </div>

            {/* Health Stats */}
            <HealthStats />

            {/* Quick Actions */}
            <QuickActions />

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
                <UpcomingAppointments />
                <MedicationReminder />
                <RecentActivity />
                <HealthTips />
                <BMICalculator />
                <EmergencyContacts />
            </div>
        </div>
    );
};

export default Dashboard;