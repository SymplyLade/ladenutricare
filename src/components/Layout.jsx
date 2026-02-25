// import React, { useState, useRef, useEffect } from 'react';
// import { 
//     Menu, Home, Activity, Calendar, MessageSquare, Clock, LogOut, User 
// } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import backgroundImage from '../assets/hospital-bg.jpg';

// const navItems = [
//     { label: 'Dashboard', path: '/', icon: <Home size={20} /> },
//     { label: 'Symptoms', path: '/symptoms', icon: <Activity size={20} /> },
//     { label: 'Expiry Check', path: '/expiry', icon: <Clock size={20} /> },
//     { label: 'Chatbot', path: '/chatbot', icon: <MessageSquare size={20} /> },
//     { label: 'Appointments', path: '/appointments', icon: <Calendar size={20} /> },
//     { label: 'Profile', path: '/profile', icon: <User size={20} /> },
// ];

// const Layout = ({ children }) => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//     const [darkMode, setDarkMode] = useState(true);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user, logout } = useAuth();

//     const toggleDarkMode = () => setDarkMode(!darkMode);

//     return (
//         <div style={{ display: 'flex', minHeight: '100vh' }}>

//             {/* Sidebar */}
//             <aside
//                 style={{
//                     width: isSidebarOpen ? '260px' : '80px',
//                     padding: '1.5rem',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     transition: 'width 0.3s ease',
//                     position: 'fixed',
//                     height: '100vh',
//                     zIndex: 10,
//                     color: darkMode ? 'white' : '#333',
//                     backgroundImage: `
//                         linear-gradient(${darkMode ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)'},
//                                         ${darkMode ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)'}),
//                         url(${backgroundImage})
//                     `,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center'
//                 }}
//             >
//                 {/* Logo */}
//                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
//                     <div
//                         style={{
//                             width: '40px',
//                             height: '40px',
//                             borderRadius: '50%',
//                             backgroundColor: darkMode ? 'white' : '#000',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             color: darkMode ? '#000' : 'white',
//                             fontWeight: 'bold'
//                         }}
//                     >
//                         LNC
//                     </div>
//                     {isSidebarOpen && (
//                         <span style={{ marginLeft: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
//                             LadeNutriCare
//                         </span>
//                     )}
//                 </div>

//                 {/* Navigation */}
//                 <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                     {navItems.map((item) => (
//                         <NavItem
//                             key={item.path}
//                             icon={item.icon}
//                             label={item.label}
//                             active={location.pathname === item.path}
//                             isOpen={isSidebarOpen}
//                             onClick={() => navigate(item.path)}
//                             darkMode={darkMode}
//                         />
//                     ))}
//                 </nav>

//                 {/* Bottom actions */}
//                 <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                     <NavItem
//                         icon={<LogOut size={20} />}
//                         label="Logout"
//                         isOpen={isSidebarOpen}
//                         onClick={() => { logout(); navigate('/login'); }}
//                         darkMode={darkMode}
//                     />
//                     <NavItem
//                         icon={<Menu size={20} />}
//                         label="Collapse"
//                         isOpen={isSidebarOpen}
//                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                         darkMode={darkMode}
//                     />
//                     <button
//                         onClick={toggleDarkMode}
//                         style={{
//                             marginTop: '1rem',
//                             padding: '0.6rem',
//                             borderRadius: '0.5rem',
//                             cursor: 'pointer',
//                             border: 'none',
//                             backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
//                             color: darkMode ? 'white' : 'black'
//                         }}
//                     >
//                         {darkMode ? 'Light Mode' : 'Dark Mode'}
//                     </button>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <div
//                 style={{
//                     flex: 1,
//                     marginLeft: isSidebarOpen ? '260px' : '80px',
//                     transition: 'margin-left 0.3s ease',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     backgroundColor: darkMode ? '#1e1e2f' : '#f8fafc',
//                     color: darkMode ? 'white' : '#000'
//                 }}
//             >
//                 <header
//                     style={{
//                         height: '80px',
//                         backgroundColor: darkMode ? 'rgba(30,30,47,0.85)' : 'rgba(255,255,255,0.85)',
//                         backdropFilter: 'blur(10px)',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         padding: '0 2rem',
//                         borderBottom: `1px solid ${darkMode ? '#333' : '#e2e8f0'}`,
//                         position: 'sticky',
//                         top: 0,
//                         zIndex: 5
//                     }}
//                 >
//                     <h1>
//                         Welcome, <span style={{ color: 'var(--color-primary)' }}>{user?.name}</span>
//                     </h1>
//                 </header>

//                 <main style={{ padding: '2rem', flex: 1 }}>
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// };

// const NavItem = ({ icon, label, isOpen, active, onClick, darkMode }) => (
//     <div
//         onClick={onClick}
//         style={{
//             display: 'flex',
//             alignItems: 'center',
//             padding: '0.8rem',
//             borderRadius: '0.5rem',
//             cursor: 'pointer',
//             backgroundColor: active ? (darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)') : 'transparent',
//             color: darkMode ? 'white' : '#333'
//         }}
//     >
//         {icon}
//         {isOpen && <span style={{ marginLeft: '1rem' }}>{label}</span>}
//     </div>
// );

// export default Layout;




import React, { useState, useRef, useEffect } from 'react';
import {
    Menu,
    Home,
    Activity,
    Calendar,
    MessageSquare,
    Clock,
    LogOut,
    Users,
    CheckSquare
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/hospital-bg.jpg';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Close search/results outside click (optional)
    const searchRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                // setShowResults(false); // optional
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sidebar navigation items
    const userNav = [
        { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Activity size={20} />, label: 'Symptoms', path: '/symptoms' },
        { icon: <Clock size={20} />, label: 'Expiry Check', path: '/expiry' },
        { icon: <MessageSquare size={20} />, label: 'Chatbot', path: '/chatbot' },
        { icon: <Calendar size={20} />, label: 'Appointments', path: '/appointments' },
        { icon: <Users size={20} />, label: 'Profile', path: '/profile' },
    ];

    const adminNav = [
        { icon: <Home size={20} />, label: 'Admin Dashboard', path: '/admin' },
        { icon: <CheckSquare size={20} />, label: 'Pending Actions', path: '/admin/pending' },
        { icon: <Users size={20} />, label: 'Manage Users', path: '/admin/users' },
        { icon: <Calendar size={20} />, label: 'Appointments', path: '/appointments' },
        { icon: <MessageSquare size={20} />, label: 'Chatbot', path: '/chatbot' },
    ];

    const navItems = user.role === 'admin' ? adminNav : userNav;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>

            {/* SIDEBAR */}
            <aside
                style={{
                    width: isSidebarOpen ? '260px' : '80px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.3s ease',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 10,
                    color: darkMode ? 'white' : '#333',
                    backgroundImage: `
                        linear-gradient(${darkMode ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)'}, 
                                        ${darkMode ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)'}),
                        url(${backgroundImage})
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: darkMode ? 'white' : '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: darkMode ? '#000' : 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        LNC
                    </div>
                    {isSidebarOpen && (
                        <span style={{ marginLeft: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                            LadeNutriCare
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            isOpen={isSidebarOpen}
                            active={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            darkMode={darkMode}
                        />
                    ))}
                </nav>

                {/* Bottom actions */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavItem icon={<LogOut size={20} />} label="Logout" isOpen={isSidebarOpen} onClick={handleLogout} darkMode={darkMode} />
                    <NavItem icon={<Menu size={20} />} label="Collapse" isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} darkMode={darkMode} />
                    <button
                        onClick={toggleDarkMode}
                        style={{
                            marginTop: '1rem',
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                            color: darkMode ? 'white' : 'black'
                        }}
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div
                style={{
                    flex: 1,
                    marginLeft: isSidebarOpen ? '260px' : '80px',
                    transition: 'margin-left 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: darkMode ? '#1e1e2f' : '#f8fafc',
                    color: darkMode ? 'white' : '#000'
                }}
            >
                {/* Header */}
                <header
                    style={{
                        height: '80px',
                        backgroundColor: darkMode ? 'rgba(30,30,47,0.85)' : 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 2rem',
                        borderBottom: `1px solid ${darkMode ? '#333' : '#e2e8f0'}`,
                        position: 'sticky',
                        top: 0,
                        zIndex: 5
                    }}
                >
                    <h1>
                        Welcome, <span style={{ color: 'var(--color-primary)' }}>{user?.name}</span>
                    </h1>
                </header>

                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, isOpen, active, onClick, darkMode }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.8rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: active ? (darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)') : 'transparent',
            color: darkMode ? 'white' : '#333'
        }}
    >
        {icon}
        {isOpen && <span style={{ marginLeft: '1rem' }}>{label}</span>}
    </div>
);

export default Layout;