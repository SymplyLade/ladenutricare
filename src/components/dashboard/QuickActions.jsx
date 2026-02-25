import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, MessageSquare, Calendar } from 'lucide-react';

const actions = [
    { label: 'Check Symptoms', icon: <Activity size={24} />, path: '/symptoms', color: '#dcfce7', iconColor: '#16a34a' },
    { label: 'Expiry Check', icon: <Clock size={24} />, path: '/expiry', color: '#fef9c3', iconColor: '#ca8a04' },
    { label: 'Open Chatbot', icon: <MessageSquare size={24} />, path: '/chatbot', color: '#dbeafe', iconColor: '#2563eb' },
    { label: 'Book Appointment', icon: <Calendar size={24} />, path: '/appointments', color: '#fce7f3', iconColor: '#db2777' },
];

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {actions.map((action, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(action.path)}
                        className="card"
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: '1.5rem', cursor: 'pointer',
                            gap: '0.75rem', textAlign: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            padding: '0.75rem', backgroundColor: action.color,
                            borderRadius: '0.75rem', color: action.iconColor
                        }}>
                            {action.icon}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--color-text-main)' }}>
                            {action.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;