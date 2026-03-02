import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected user pages
import Dashboard from './pages/Dashboard';
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

// Admin imports
import AdminLayout from './admin/AdminLayout';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import AdminDoctors from './admin/pages/AdminDoctors';
import AdminAppointments from './admin/pages/AdminAppointments';
import AdminPayments from './admin/pages/AdminPayments';
import AdminNutrition from './admin/pages/AdminNutrition';
import AdminSettings from './admin/pages/AdminSettings';

// Component to conditionally show Navbar/Footer (not on admin routes)
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
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
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
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <AppointmentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptom-checker"
              element={
                <ProtectedRoute>
                  <SymptomChecker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition/:patientTypeId"
              element={
                <ProtectedRoute>
                  <PatientTypeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-nutrition-plan"
              element={
                <ProtectedRoute>
                  <MyNutritionPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency-contacts"
              element={
                <ProtectedRoute>
                  <EmergencyContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medications"
              element={
                <ProtectedRoute>
                  <Medications />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
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
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;