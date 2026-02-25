// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const { login } = useAuth();
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleLogin = () => {
//         if (!email.trim() || !password.trim()) {
//             setError('Please fill in all fields.');
//             return;
//         }

//         // Retrieve user from localStorage
//         const storedUser = JSON.parse(localStorage.getItem('medicare_user'));

//         if (!storedUser || storedUser.email !== email) {
//             setError('No account found with this email.');
//             return;
//         }

//         if (storedUser.password !== password) {
//             setError('Incorrect password.');
//             return;
//         }

//         login(storedUser);
//         navigate('/');
//     };

//     return (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
//             <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
//                 <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
//                     Welcome Back 👋
//                 </h2>
//                 <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
//                     Sign in to your MediCare account
//                 </p>

//                 {error && (
//                     <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
//                 )}

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
//                         <input
//                             type="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
//                         <input
//                             type="password"
//                             placeholder="Enter your password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>

//                     <div style={{ textAlign: 'right' }}>
//                         <span
//                             onClick={() => navigate('/forgot-password')}
//                             style={{ fontSize: '0.85rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
//                             Forgot Password?
//                         </span>
//                     </div>

//                     <button onClick={handleLogin} style={{ width: '100%', marginTop: '0.5rem' }}>
//                         Sign In
//                     </button>

//                     <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
//                         Don't have an account?{' '}
//                         <span
//                             onClick={() => navigate('/signup')}
//                             style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}>
//                             Sign Up
//                         </span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;





import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // For demo purposes: ensure at least one admin exists
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('medicare_user'));
        if (!storedUser) {
            // Default admin
            localStorage.setItem('medicare_user', JSON.stringify({
                name: 'Admin',
                email: 'admin@medicare.com',
                password: 'admin123',
                role: 'admin',
            }));
        }
    }, []);

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        // Retrieve user from localStorage
        const storedUser = JSON.parse(localStorage.getItem('medicare_user'));

        if (!storedUser || storedUser.email !== email) {
            setError('No account found with this email.');
            return;
        }

        if (storedUser.password !== password) {
            setError('Incorrect password.');
            return;
        }

        login(storedUser);

        // Redirect based on role
        if (storedUser.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Welcome Back 👋
                </h2>
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Sign in to your MediCare account
                </p>

                {error && (
                    <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <span
                            onClick={() => navigate('/forgot-password')}
                            style={{ fontSize: '0.85rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
                            Forgot Password?
                        </span>
                    </div>

                    <button
                        onClick={handleLogin}
                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem' }}
                    >
                        Sign In
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/signup')}
                            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}>
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;