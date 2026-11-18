import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { respondToAppointmentAvailability } from '../services/appointments';
import { generateVideoLink, getGoogleMeetConnectUrl, getGoogleMeetStatus } from '../services/videoConsultation';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respondingId, setRespondingId] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleMessage, setGoogleMessage] = useState('');
  const [meetingId, setMeetingId] = useState(null);
  const [formatChoices, setFormatChoices] = useState({});

  useEffect(() => {
    fetchAppointments();
    const googleResult = new URLSearchParams(window.location.search).get('google_meet');
    if (googleResult === 'connected') setGoogleMessage('Google account connected successfully.');
    if (googleResult === 'failed') setGoogleMessage('Google connection failed. Please try again.');
    getGoogleMeetStatus()
      .then((response) => setGoogleConnected(Boolean(response.data?.connected)))
      .catch(() => setGoogleConnected(false))
      .finally(() => setGoogleLoading(false));
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

  const respondToRequest = async (id, available, consultationFormat) => {
    setError('');
    setRespondingId(id);
    try {
      await respondToAppointmentAvailability(id, available, consultationFormat);
      await fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update appointment availability');
    } finally {
      setRespondingId(null);
    }
  };

  const connectGoogle = async () => {
    setError('');
    try {
      const response = await getGoogleMeetConnectUrl();
      window.location.assign(response.data.authorization_url);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not start Google account connection');
    }
  };

  const createMeeting = async (id) => {
    setError('');
    setMeetingId(id);
    try {
      const response = await generateVideoLink(id);
      setAppointments(current => current.map(apt => (
        apt.id === id ? { ...apt, video_link: response.data.video_link } : apt
      )));
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create Google Meet link');
    } finally {
      setMeetingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'doctor_confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <p className="font-medium text-gray-900">Google Meet</p>
          <p className="text-sm text-gray-600">
            {googleLoading ? 'Checking connection…' : googleConnected ? 'Google account connected' : 'Connect Google to create patient meeting links'}
          </p>
          {googleMessage && <p className="mt-1 text-sm text-indigo-700">{googleMessage}</p>}
        </div>
        {!googleLoading && !googleConnected && (
          <button type="button" onClick={connectGoogle} className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Connect Google
          </button>
        )}
      </div>

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
                    <p className="mt-1 text-xs text-gray-600">
                      Consultation: {String(apt.consultation_format || 'google_meet').replaceAll('_', ' ')}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {apt.appointment_date}
                      <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                      {apt.appointment_time}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                    {apt.status === 'pending' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={formatChoices[apt.id] || apt.consultation_format || 'google_meet'}
                          onChange={(event) => setFormatChoices(current => ({ ...current, [apt.id]: event.target.value }))}
                          disabled={respondingId === apt.id}
                          aria-label={`Consultation format for ${apt.patient_name}`}
                          className="rounded border border-gray-300 px-2 py-1 text-xs"
                        >
                          <option value="google_meet">Google Meet</option>
                          <option value="phone">Phone call</option>
                          <option value="in_person">In person</option>
                        </select>
                        <button
                          type="button"
                          disabled={respondingId === apt.id}
                          onClick={() => respondToRequest(apt.id, true, formatChoices[apt.id] || apt.consultation_format || 'google_meet')}
                          className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {respondingId === apt.id ? 'Saving…' : 'Confirm availability'}
                        </button>
                        <button
                          type="button"
                          disabled={respondingId === apt.id}
                          onClick={() => respondToRequest(apt.id, false)}
                          className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {apt.status === 'approved' && apt.payment_status === 'completed' && apt.consultation_format === 'google_meet' && (
                      apt.video_link ? (
                        <a href={apt.video_link} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                          Open Google Meet
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled={!googleConnected || meetingId === apt.id}
                          onClick={() => createMeeting(apt.id)}
                          className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {meetingId === apt.id ? 'Creating…' : 'Create Google Meet'}
                        </button>
                      )
                    )}
                    {apt.status === 'approved' && apt.payment_status === 'completed' && apt.consultation_format !== 'google_meet' && (
                      <span className="text-xs text-gray-600">Confirmed: {String(apt.consultation_format).replaceAll('_', ' ')}</span>
                    )}
                  </div>
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
