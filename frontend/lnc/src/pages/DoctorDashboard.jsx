import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/doctor');
      setAppointments(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, Dr. {user?.name}</p>

      {error && <div className="bg-red-100 p-3 rounded mb-4">{error}</div>}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <h2 className="text-lg font-medium text-gray-900 px-6 py-4 border-b">Your Appointments</h2>

        {appointments.length === 0 ? (
          <div className="px-6 py-8 text-sm text-gray-500">No appointments assigned yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.map((apt) => (
              <li key={apt.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {apt.patient_name} - {apt.department}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {apt.appointment_date}
                      <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                      {apt.appointment_time}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
