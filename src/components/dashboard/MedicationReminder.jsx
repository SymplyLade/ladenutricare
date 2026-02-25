// import React, { useState } from 'react';
// import { Clock, Plus, Trash2, Check } from 'lucide-react';

// const MedicationReminder = () => {
//     const [medications, setMedications] = useState([
//         { id: 1, name: 'Vitamin C', dosage: '500mg', time: '08:00 AM', taken: false },
//         { id: 2, name: 'Metformin', dosage: '850mg', time: '01:00 PM', taken: true },
//         { id: 3, name: 'Omega-3', dosage: '1000mg', time: '08:00 PM', taken: false },
//     ]);
//     const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
//     const [showForm, setShowForm] = useState(false);

//     const toggleTaken = (id) => {
//         setMedications(medications.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
//     };

//     const addMedication = () => {
//         if (!newMed.name || !newMed.dosage || !newMed.time) return;
//         setMedications([...medications, { id: Date.now(), ...newMed, taken: false }]);
//         setNewMed({ name: '', dosage: '', time: '' });
//         setShowForm(false);
//     };

//     const deleteMedication = (id) => {
//         setMedications(medications.filter(m => m.id !== id));
//     };

//     return (
//         <div className="card">
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
//                     <Clock size={22} />
//                     <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Medication Reminder</h3>
//                 </div>
//                 <button
//                     onClick={() => setShowForm(!showForm)}
//                     style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
//                 >
//                     <Plus size={14} /> Add
//                 </button>
//             </div>

//             {showForm && (
//                 <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                     <input type="text" placeholder="Medicine name" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} style={{ width: '100%' }} />
//                     <input type="text" placeholder="Dosage (e.g. 500mg)" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} style={{ width: '100%' }} />
//                     <input type="time" value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} style={{ width: '100%' }} />
//                     <button onClick={addMedication} style={{ width: '100%' }}>Save Medication</button>
//                 </div>
//             )}

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//                 {medications.map(med => (
//                     <div key={med.id} style={{
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         padding: '0.75rem', backgroundColor: med.taken ? '#f0fdf4' : '#f8fafc',
//                         borderRadius: '0.75rem', border: `1px solid ${med.taken ? '#bbf7d0' : '#e2e8f0'}`
//                     }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                             <div
//                                 onClick={() => toggleTaken(med.id)}
//                                 style={{
//                                     width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
//                                     backgroundColor: med.taken ? 'var(--color-primary)' : 'white',
//                                     border: '2px solid var(--color-primary)',
//                                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                     flexShrink: 0
//                                 }}
//                             >
//                                 {med.taken && <Check size={14} color="white" />}
//                             </div>
//                             <div>
//                                 <p style={{ fontWeight: '500', fontSize: '0.9rem', textDecoration: med.taken ? 'line-through' : 'none', color: med.taken ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
//                                     {med.name}
//                                 </p>
//                                 <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{med.dosage} • {med.time}</p>
//                             </div>
//                         </div>
//                         <Trash2 size={16} onClick={() => deleteMedication(med.id)} style={{ color: '#ef4444', cursor: 'pointer', flexShrink: 0 }} />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MedicationReminder;


import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Check } from 'lucide-react';
import { logActivity } from '../../utils/logActivity';

const MedicationReminder = () => {
    const [medications, setMedications] = useState([]);
    const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('medications') || '[]');
        setMedications(stored);
    }, []);

    const save = (updated) => {
        setMedications(updated);
        localStorage.setItem('medications', JSON.stringify(updated));
    };

    const toggleTaken = (id) => {
        const updated = medications.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
        save(updated);
    };

    const addMedication = () => {
        if (!newMed.name || !newMed.dosage || !newMed.time) return;
        const updated = [...medications, { id: Date.now(), ...newMed, taken: false }];
        save(updated);
        logActivity('medication', `Added medication: ${newMed.name} ${newMed.dosage}`);
        setNewMed({ name: '', dosage: '', time: '' });
        setShowForm(false);
    };

    const deleteMedication = (id) => {
        const updated = medications.filter(m => m.id !== id);
        save(updated);
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
                    <Clock size={22} />
                    <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Medication Reminder</h3>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                    <Plus size={14} /> Add
                </button>
            </div>

            {showForm && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input type="text" placeholder="Medicine name" value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} style={{ width: '100%' }} />
                    <input type="text" placeholder="Dosage (e.g. 500mg)" value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })} style={{ width: '100%' }} />
                    <input type="time" value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} style={{ width: '100%' }} />
                    <button onClick={addMedication} style={{ width: '100%' }}>Save Medication</button>
                </div>
            )}

            {medications.length === 0 && !showForm ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💊</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        No medications added yet. Click Add to track your medications.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {medications.map(med => (
                        <div key={med.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.75rem', backgroundColor: med.taken ? '#f0fdf4' : '#f8fafc',
                            borderRadius: '0.75rem', border: `1px solid ${med.taken ? '#bbf7d0' : '#e2e8f0'}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div
                                    onClick={() => toggleTaken(med.id)}
                                    style={{
                                        width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
                                        backgroundColor: med.taken ? 'var(--color-primary)' : 'white',
                                        border: '2px solid var(--color-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}
                                >
                                    {med.taken && <Check size={14} color="white" />}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500', fontSize: '0.9rem', textDecoration: med.taken ? 'line-through' : 'none', color: med.taken ? 'var(--color-text-muted)' : 'var(--color-text-main)' }}>
                                        {med.name}
                                    </p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{med.dosage} • {med.time}</p>
                                </div>
                            </div>
                            <Trash2 size={16} onClick={() => deleteMedication(med.id)} style={{ color: '#ef4444', cursor: 'pointer', flexShrink: 0 }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MedicationReminder;