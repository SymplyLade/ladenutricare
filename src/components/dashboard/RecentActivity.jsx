// import React from 'react';
// import { Activity, Calendar, Clock, MessageSquare, User } from 'lucide-react';

// const activities = [
//     { icon: <Activity size={16} />, text: 'Checked symptoms: Headache, Fever', time: '2 hours ago', color: '#dbeafe', iconColor: '#2563eb' },
//     { icon: <Calendar size={16} />, text: 'Booked appointment with Dr. Sarah', time: '5 hours ago', color: '#dcfce7', iconColor: '#16a34a' },
//     { icon: <Clock size={16} />, text: 'Checked expiry of Batch #9082A', time: 'Yesterday', color: '#fef9c3', iconColor: '#ca8a04' },
//     { icon: <MessageSquare size={16} />, text: 'Chatted with MediBot', time: 'Yesterday', color: '#fce7f3', iconColor: '#db2777' },
//     { icon: <User size={16} />, text: 'Updated profile information', time: '2 days ago', color: '#f3e8ff', iconColor: '#9333ea' },
// ];

// const RecentActivity = () => {
//     return (
//         <div className="card">
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
//                 <Activity size={22} />
//                 <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Recent Activity</h3>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//                 {activities.map((activity, index) => (
//                     <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                         <div style={{
//                             padding: '0.5rem', backgroundColor: activity.color,
//                             borderRadius: '0.5rem', color: activity.iconColor, flexShrink: 0
//                         }}>
//                             {activity.icon}
//                         </div>
//                         <div style={{ flex: 1 }}>
//                             <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: '500' }}>{activity.text}</p>
//                             <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{activity.time}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default RecentActivity;



import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

const iconMap = {
    symptoms: '🩺',
    appointments: '📅',
    expiry: '💊',
    chatbot: '💬',
    profile: '👤',
    medication: '⏰',
    emergency: '📞',
};

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        setActivities(stored);
    }, []);

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                <Activity size={22} />
                <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Recent Activity</h3>
            </div>

            {activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        No recent activity yet. Start using the app to see your activity here.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {activities.slice(0, 5).map((activity, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '0.5rem',
                                backgroundColor: '#f1f5f9', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', flexShrink: 0
                            }}>
                                {iconMap[activity.type] || '📌'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', fontWeight: '500' }}>{activity.text}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;