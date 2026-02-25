// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const ResetPassword = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const email = location.state?.email;

//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');

//     const handleReset = () => {
//         if (!newPassword.trim() || !confirmPassword.trim()) {
//             setError('Please fill in all fields.');
//             return;
//         }
//         if (newPassword !== confirmPassword) {
//             setError('Passwords do not match.');
//             return;
//         }
//         if (newPassword.length < 6) {
//             setError('Password must be at least 6 characters.');
//             return;
//         }

//         // Update password in localStorage
//         const storedUser = JSON.parse(localStorage.getItem('medicare_user'));
//         if (storedUser && storedUser.email === email) {
//             localStorage.setItem('medicare_user', JSON.stringify({ ...storedUser, password: newPassword }));
//         }

//         setError('');
//         setMessage('Password reset successful! Redirecting to login...');
//         setTimeout(() => navigate('/login'), 2000);
//     };

//     // Guard: if no email in state, redirect back
//     if (!email) {
//         navigate('/forgot-password');
//         return null;
//     }

//     return (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
//             <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
//                 <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
//                     Reset Password 🔒
//                 </h2>
//                 <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
//                     Enter your new password below
//                 </p>

//                 {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
//                 {message && <p style={{ color: 'green', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>New Password</label>
//                         <input
//                             type="password"
//                             placeholder="Enter new password"
//                             value={newPassword}
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Confirm New Password</label>
//                         <input
//                             type="password"
//                             placeholder="Confirm new password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>

//                     <button onClick={handleReset} style={{ width: '100%', marginTop: '0.5rem' }}>
//                         Reset Password
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ResetPassword;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Get email from localStorage if available
        const resetEmail = localStorage.getItem('reset_email');
        if (!resetEmail) {
            navigate('/forgot-password'); // redirect if no email
        } else {
            setEmail(resetEmail);
        }
    }, [navigate]);

    const handleReset = () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        // Update password in localStorage
        const storedUser = JSON.parse(localStorage.getItem('medicare_user'));
        if (storedUser && storedUser.email === email) {
            const updatedUser = { ...storedUser, password: newPassword };
            localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
        }

        // Clear reset email after success
        localStorage.removeItem('reset_email');

        setError('');
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
    };

    if (!email) return null; // prevent rendering before email is set

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Reset Password 🔒
                </h2>
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Enter your new password below
                </p>

                {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <button
                        onClick={handleReset}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem'
                        }}
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;