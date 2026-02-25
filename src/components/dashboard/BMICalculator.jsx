import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');

    const calculateBMI = () => {
        if (!height || !weight) return;
        const heightM = parseFloat(height) / 100;
        const bmiValue = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
        setBmi(bmiValue);

        if (bmiValue < 18.5) setCategory({ label: 'Underweight', color: '#2563eb' });
        else if (bmiValue < 25) setCategory({ label: 'Normal', color: '#16a34a' });
        else if (bmiValue < 30) setCategory({ label: 'Overweight', color: '#ca8a04' });
        else setCategory({ label: 'Obese', color: '#ef4444' });
    };

    const getBarWidth = () => {
        if (!bmi) return '0%';
        const capped = Math.min(Math.max(bmi, 10), 40);
        return `${((capped - 10) / 30) * 100}%`;
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                <Activity size={22} />
                <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>BMI Calculator</h3>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '500' }}>Height (cm)</label>
                    <input type="number" placeholder="e.g. 170" value={height} onChange={e => setHeight(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '500' }}>Weight (kg)</label>
                    <input type="number" placeholder="e.g. 65" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%' }} />
                </div>
            </div>

            <button onClick={calculateBMI} style={{ width: '100%', marginBottom: '1rem' }}>Calculate BMI</button>

            {bmi && (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: category.color }}>{bmi}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: category.color, marginBottom: '0.75rem' }}>{category.label}</p>

                    {/* BMI Bar */}
                    <div style={{ height: '10px', backgroundColor: '#e2e8f0', borderRadius: '1rem', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div style={{
                            height: '100%', width: getBarWidth(),
                            backgroundColor: category.color,
                            borderRadius: '1rem',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        <span>Underweight</span>
                        <span>Normal</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;