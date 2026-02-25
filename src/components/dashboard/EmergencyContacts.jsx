// import React, { useState } from 'react';
// import { Phone, Plus, Trash2 } from 'lucide-react';

// const EmergencyContacts = () => {
//     const [contacts, setContacts] = useState([
//         { id: 1, name: 'John Doe', relation: 'Father', phone: '+234 801 234 5678' },
//         { id: 2, name: 'Mary Doe', relation: 'Mother', phone: '+234 802 345 6789' },
//     ]);
//     const [showForm, setShowForm] = useState(false);
//     const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

//     const addContact = () => {
//         if (!newContact.name || !newContact.phone) return;
//         setContacts([...contacts, { id: Date.now(), ...newContact }]);
//         setNewContact({ name: '', relation: '', phone: '' });
//         setShowForm(false);
//     };

//     const deleteContact = (id) => {
//         setContacts(contacts.filter(c => c.id !== id));
//     };

//     return (
//         <div className="card">
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
//                     <Phone size={22} />
//                     <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Emergency Contacts</h3>
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
//                     <input type="text" placeholder="Full name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} style={{ width: '100%' }} />
//                     <input type="text" placeholder="Relation (e.g. Father)" value={newContact.relation} onChange={e => setNewContact({ ...newContact, relation: e.target.value })} style={{ width: '100%' }} />
//                     <input type="tel" placeholder="Phone number" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} style={{ width: '100%' }} />
//                     <button onClick={addContact} style={{ width: '100%' }}>Save Contact</button>
//                 </div>
//             )}

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//                 {contacts.map(contact => (
//                     <div key={contact.id} style={{
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem'
//                     }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                             <div style={{
//                                 width: '40px', height: '40px', borderRadius: '50%',
//                                 backgroundColor: '#dcfce7', color: 'var(--color-primary)',
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                 fontWeight: 'bold', fontSize: '1rem', flexShrink: 0
//                             }}>
//                                 {contact.name.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                                 <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{contact.name}</p>
//                                 <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{contact.relation} • {contact.phone}</p>
//                             </div>
//                         </div>
//                         <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
//                             <a href={`tel:${contact.phone}`}>
//                                 <Phone size={16} style={{ color: 'var(--color-primary)', cursor: 'pointer' }} />
//                             </a>
//                             <Trash2 size={16} onClick={() => deleteContact(contact.id)} style={{ color: '#ef4444', cursor: 'pointer' }} />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default EmergencyContacts;



import React, { useState, useEffect } from 'react';
import { Phone, Plus, Trash2 } from 'lucide-react';
import { logActivity } from '../../utils/logActivity';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
        setContacts(stored);
    }, []);

    const save = (updated) => {
        setContacts(updated);
        localStorage.setItem('emergencyContacts', JSON.stringify(updated));
    };

    const addContact = () => {
        if (!newContact.name || !newContact.phone) return;
        const updated = [...contacts, { id: Date.now(), ...newContact }];
        save(updated);
        logActivity('emergency', `Added emergency contact: ${newContact.name}`);
        setNewContact({ name: '', relation: '', phone: '' });
        setShowForm(false);
    };

    const deleteContact = (id) => {
        const updated = contacts.filter(c => c.id !== id);
        save(updated);
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
                    <Phone size={22} />
                    <h3 style={{ marginLeft: '0.75rem', fontSize: '1rem', fontWeight: '600' }}>Emergency Contacts</h3>
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
                    <input type="text" placeholder="Full name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} style={{ width: '100%' }} />
                    <input type="text" placeholder="Relation (e.g. Father)" value={newContact.relation} onChange={e => setNewContact({ ...newContact, relation: e.target.value })} style={{ width: '100%' }} />
                    <input type="tel" placeholder="Phone number" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} style={{ width: '100%' }} />
                    <button onClick={addContact} style={{ width: '100%' }}>Save Contact</button>
                </div>
            )}

            {contacts.length === 0 && !showForm ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📞</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        No emergency contacts added yet. Click Add to save a contact.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {contacts.map(contact => (
                        <div key={contact.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    backgroundColor: '#dcfce7', color: 'var(--color-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '1rem', flexShrink: 0
                                }}>
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{contact.name}</p>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{contact.relation} • {contact.phone}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <a href={`tel:${contact.phone}`}>
                                    <Phone size={16} style={{ color: 'var(--color-primary)', cursor: 'pointer' }} />
                                </a>
                                <Trash2 size={16} onClick={() => deleteContact(contact.id)} style={{ color: '#ef4444', cursor: 'pointer' }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmergencyContacts;