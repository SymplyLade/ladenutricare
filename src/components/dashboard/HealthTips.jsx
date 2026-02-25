import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

const tips = [
    "Drink at least 8 glasses of water daily to stay hydrated.",
    "Aim for 7–9 hours of quality sleep every night.",
    "Take a 5-minute walk every hour if you sit for long periods.",
    "Eat at least 5 portions of fruit and vegetables a day.",
    "Practice deep breathing for 5 minutes to reduce stress.",
    "Wash your hands frequently to prevent infections.",
    "Limit screen time before bed to improve sleep quality.",
    "Regular health checkups can catch problems early.",
    "Exercise for at least 30 minutes, 5 days a week.",
    "Avoid skipping meals — it can lead to overeating later.",
];

const HealthTips = () => {
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % tips.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const nextTip = () => setTipIndex(prev => (prev + 1) % tips.length);

    return (
        <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
                    <Lightbulb size={22} />
                    <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Health Tip of the Day</h3>
                </div>
                <RefreshCw
                    size={18}
                    onClick={nextTip}
                    style={{ color: 'var(--color-primary)', cursor: 'pointer' }}
                    title="Next tip"
                />
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: '1.6', fontStyle: 'italic' }}>
                "{tips[tipIndex]}"
            </p>

            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '1rem' }}>
                {tips.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setTipIndex(i)}
                        style={{
                            width: i === tipIndex ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: i === tipIndex ? 'var(--color-primary)' : '#bbf7d0',
                            cursor: 'pointer',
                            transition: 'width 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HealthTips;