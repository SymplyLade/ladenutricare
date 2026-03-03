import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import AppointmentDetail from './pages/AppointmentDetail';
import SymptomChecker from './pages/SymptomChecker';
import Nutrition from './pages/Nutrition';
import PatientTypeDetail from './pages/PatientTypeDetail';
import MyNutritionPlan from './pages/MyNutritionPlan';
import EmergencyContacts from './pages/EmergencyContacts';
import Medications from './pages/Medications';
import Notifications from './pages/Notifications';

import AdminLayout from './admin/AdminLayout';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import AdminDoctors from './admin/pages/AdminDoctors';
import AdminAppointments from './admin/pages/AdminAppointments';
import AdminPayments from './admin/pages/AdminPayments';
import AdminNutrition from './admin/pages/AdminNutrition';
import AdminNotifications from './admin/pages/AdminNotifications';
import AdminSettings from './admin/pages/AdminSettings';

import { getRoleHomePath } from './config/roleConfig';

const NotFound = () => (
  <div className="max-w-3xl mx-auto py-16 px-4 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-3">Page not found</h1>
    <p className="text-gray-600">The page you are looking for does not exist.</p>
  </div>
);

const RoleDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  const roleHome = getRoleHomePath(user.role);
  if (roleHome !== '/dashboard') return <Navigate to={roleHome} replace />;
  return <Dashboard />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute requiredRole="user">
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute requiredRole="user">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute requiredRole="user">
                  <AppointmentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptom-checker"
              element={
                <ProtectedRoute requiredRole="user">
                  <SymptomChecker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute requiredRole="user">
                  <Nutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition/:patientTypeId"
              element={
                <ProtectedRoute requiredRole="user">
                  <PatientTypeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-nutrition-plan"
              element={
                <ProtectedRoute requiredRole="user">
                  <MyNutritionPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency-contacts"
              element={
                <ProtectedRoute requiredRole="user">
                  <EmergencyContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medications"
              element={
                <ProtectedRoute requiredRole="user">
                  <Medications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="nutrition" element={<AdminNutrition />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
