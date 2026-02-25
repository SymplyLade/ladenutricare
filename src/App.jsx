
// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Layout from './components/Layout';
// import Dashboard from './components/Dashboard';
// import AppointmentBooking from './components/AppointmentBooking';
// import ChatbotWidget from './components/ChatbotWidget';
// import SymptomChecker from './components/SymptomChecker';
// import ExpiryChecker from './components/ExpiryChecker';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import Profile from './pages/Profile';
// import AdminDashboard from './pages/admin/AdminDashboard';

// // Protect routes for logged-in users
// const ProtectedRoute = ({ children, adminOnly = false }) => {
//     const { user } = useAuth();

//     if (!user) return <Navigate to="/login" />; // not logged in
//     if (adminOnly && user.role !== 'admin') return <Navigate to="/" />; // not an admin

//     return children;
// };

// function App() {
//     return (
//         <BrowserRouter>
//             <AuthProvider>
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/signup" element={<Signup />} />
//                     <Route path="/forgot-password" element={<ForgotPassword />} />
//                     <Route path="/reset-password" element={<ResetPassword />} />

//                     {/* Protected Routes for Regular Users */}
//                     <Route
//                         path="/*"
//                         element={
//                             <ProtectedRoute>
//                                 <Layout>
//                                     <Routes>
//                                         <Route path="/" element={<Dashboard />} />
//                                         <Route path="/symptoms" element={<SymptomChecker />} />
//                                         <Route path="/expiry" element={<ExpiryChecker />} />
//                                         <Route path="/chatbot" element={<ChatbotWidget />} />
//                                         <Route path="/appointments" element={<AppointmentBooking />} />
//                                         <Route path="/profile" element={<Profile />} />
//                                     </Routes>
//                                 </Layout>
//                             </ProtectedRoute>
//                         }
//                     />

//                     {/* Admin Routes */}
//                     <Route
//                         path="/admin/*"
//                         element={
//                             <ProtectedRoute adminOnly={true}>
//                                 <Layout>
//                                     <Routes>
//                                         <Route path="" element={<AdminDashboard />} />
//                                         {/* Add more admin pages here */}
//                                     </Routes>
//                                 </Layout>
//                             </ProtectedRoute>
//                         }
//                     />
//                 </Routes>
//             </AuthProvider>
//         </BrowserRouter>
//     );
// }

// export default App;




import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AppointmentBooking from './components/AppointmentBooking';
import ChatbotWidget from './components/ChatbotWidget';
import SymptomChecker from './components/SymptomChecker';
import ExpiryChecker from './components/ExpiryChecker';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protect routes for logged-in users
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />; // not logged in
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />; // not an admin

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected Routes for Regular Users */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/symptoms" element={<SymptomChecker />} />
                                        <Route path="/expiry" element={<ExpiryChecker />} />
                                        <Route path="/chatbot" element={<ChatbotWidget />} />
                                        <Route path="/appointments" element={<AppointmentBooking />} />
                                        <Route path="/profile" element={<Profile />} />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <Layout>
                                    <Routes>
                                        <Route path="" element={<AdminDashboard />} />
                                        <Route path="/profile" element={<Profile />} />
                                        {/* Add more admin pages here */}
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;