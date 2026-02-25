// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//     const { signup } = useAuth();
//     const navigate = useNavigate();
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSignup = () => {
//         if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
//             setError('Please fill in all fields.');
//             return;
//         }
//         if (password !== confirmPassword) {
//             setError('Passwords do not match.');
//             return;
//         }
//         if (password.length < 6) {
//             setError('Password must be at least 6 characters.');
//             return;
//         }

//         const userData = { name, email, password };

//         // Save to localStorage so login can verify
//         localStorage.setItem('medicare_user', JSON.stringify(userData));

//         signup(userData);
//         navigate('/');
//     };

//     return (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
//             <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
//                 <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
//                     Create Account 🏥
//                 </h2>
//                 <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
//                     Join MediCare today
//                 </p>

//                 {error && (
//                     <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
//                 )}

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Full Name</label>
//                         <input
//                             type="text"
//                             placeholder="Enter your full name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>
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
//                             placeholder="Create a password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Confirm Password</label>
//                         <input
//                             type="password"
//                             placeholder="Confirm your password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             style={{ width: '100%' }}
//                         />
//                     </div>

//                     <button onClick={handleSignup} style={{ width: '100%', marginTop: '0.5rem' }}>
//                         Create Account
//                     </button>

//                     <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
//                         Already have an account?{' '}
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

// export default Signup;



import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // default role
    const [error, setError] = useState('');

    const handleSignup = () => {
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        const userData = { name, email, password, role };

        // Save to localStorage so login can verify
        localStorage.setItem('medicare_user', JSON.stringify(userData));

        signup(userData);

        // Redirect based on role
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Create Account 🏥
                </h2>
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Join MediCare today
                </p>

                {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Full Name</label>
                        <input type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
                        <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Confirm Password</label>
                        <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button onClick={handleSignup} style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.5rem' }}>
                        Create Account
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}>
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;