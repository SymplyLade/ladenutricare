// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = () => {
//         if (!email.trim()) {
//             setError('Please enter your email.');
//             return;
//         }

//         const storedUser = JSON.parse(localStorage.getItem('medicare_user'));

//         if (!storedUser || storedUser.email !== email) {
//             setError('No account found with this email.');
//             return;
//         }

//         // In a real app, you'd send a reset email. Here we just navigate.
//         setError('');
//         setMessage('Email verified! Redirecting to reset password...');
//         setTimeout(() => navigate('/reset-password', { state: { email } }), 2000);
//     };

//     return (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
//             <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
//                 <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
//                     Forgot Password 🔑
//                 </h2>
//                 <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
//                     Enter your email to reset your password
//                 </p>

//                 {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
//                 {message && <p style={{ color: 'green', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
//                         <input
//                             type="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>

//                     <button onClick={handleSubmit} style={{ width: '100%', marginTop: '0.5rem' }}>
//                         Verify Email
//                     </button>

//                     <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
//                         Remembered your password?{' '}
//                         <span
//                             onClick={() => navigate('/login')}
//                             style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}>
//                             Sign In
//                         </span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!email.trim()) {
            setError('Please enter your email.');
            return;
        }

        // Get stored user
        const storedUser = JSON.parse(localStorage.getItem('medicare_user'));

        if (!storedUser || storedUser.email !== email) {
            setError('No account found with this email.');
            setMessage('');
            return;
        }

        // Save email temporarily for reset-password page
        localStorage.setItem('reset_email', email);

        setError('');
        setMessage('Email verified! Redirecting to reset password...');

        setTimeout(() => navigate('/reset-password'), 2000);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Forgot Password 🔑
                </h2>
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Enter your email to reset your password
                </p>

                {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <button onClick={handleSubmit} style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem' }}>
                        Verify Email
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Remembered your password?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;