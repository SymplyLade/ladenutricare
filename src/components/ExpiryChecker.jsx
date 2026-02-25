// import React from 'react';
// import { Clock, CheckCircle } from 'lucide-react';
// import { logActivity } from '../utils/logActivity';
// // inside handleCheck after saving:
// logActivity('expiry', `Checked expiry of Batch #${batchCode}`);

// const ExpiryChecker = () => {
//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
//                 <Clock size={24} />
//                 <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Expiry Checker</h2>
//             </div>

//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         Batch Number / Medicine ID
//                     </label>
//                     <input
//                         type="text"
//                         placeholder="Enter batch code"
//                         style={{ width: '100%' }}
//                     />
//                 </div>

//                 <div style={{
//                     marginTop: '1rem',
//                     padding: '1rem',
//                     backgroundColor: '#f0fdf4',
//                     borderRadius: 'var(--radius-md)',
//                     border: '1px solid var(--color-primary-light)',
//                     display: 'flex',
//                     alignItems: 'start'
//                 }}>
//                     <CheckCircle size={20} color="var(--color-primary)" style={{ marginTop: '2px' }} />
//                     <div style={{ marginLeft: '0.75rem' }}>
//                         <h4 style={{ fontWeight: '600', color: 'var(--color-primary-dark)' }}>Safe to Use</h4>
//                         <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Batch #9082A is valid until Dec 2026.</p>
//                     </div>
//                 </div>

//                 <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
//                     <button style={{ width: '100%' }}>Check Expiry</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ExpiryChecker;



import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { logActivity } from '../utils/logActivity';

const ExpiryChecker = () => {
    const [batchCode, setBatchCode] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCheck = () => {
        if (!batchCode.trim() || !expiryDate) {
            setError('Please enter a batch code and expiry date.');
            return;
        }

        const today = new Date();
        const expiry = new Date(expiryDate);
        const isExpired = expiry < today;

        const entry = {
            id: Date.now(),
            batchCode,
            expiryDate,
            status: isExpired ? 'Expired' : 'Safe',
            date: new Date().toLocaleString(),
        };

        const existing = JSON.parse(localStorage.getItem('expiryChecks') || '[]');
        localStorage.setItem('expiryChecks', JSON.stringify([...existing, entry]));
        logActivity('expiry', `Checked expiry of Batch #${batchCode} — ${isExpired ? 'Expired' : 'Safe to use'}`);

        setResult({ isExpired, expiryDate });
        setError('');
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <Clock size={24} />
                <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Expiry Checker</h2>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                        Batch Number / Medicine ID
                    </label>
                    <input
                        type="text"
                        placeholder="Enter batch code"
                        value={batchCode}
                        onChange={e => setBatchCode(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                        Expiry Date
                    </label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={e => setExpiryDate(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

                {result && (
                    <div style={{
                        padding: '1rem', borderRadius: 'var(--radius-md)',
                        backgroundColor: result.isExpired ? '#fef2f2' : '#f0fdf4',
                        border: `1px solid ${result.isExpired ? '#fecaca' : '#bbf7d0'}`,
                        display: 'flex', alignItems: 'start'
                    }}>
                        {result.isExpired
                            ? <AlertTriangle size={20} color="#ef4444" style={{ marginTop: '2px' }} />
                            : <CheckCircle size={20} color="var(--color-primary)" style={{ marginTop: '2px' }} />
                        }
                        <div style={{ marginLeft: '0.75rem' }}>
                            <h4 style={{ fontWeight: '600', color: result.isExpired ? '#ef4444' : 'var(--color-primary-dark)' }}>
                                {result.isExpired ? 'Expired' : 'Safe to Use'}
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                {result.isExpired
                                    ? `This batch expired on ${new Date(result.expiryDate).toDateString()}.`
                                    : `This batch is valid until ${new Date(result.expiryDate).toDateString()}.`
                                }
                            </p>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <button onClick={handleCheck} style={{ width: '100%' }}>Check Expiry</button>
                </div>
            </div>
        </div>
    );
};

export default ExpiryChecker;