import api from './api';

export const generateVideoLink = (appointmentId) =>
  api.post('/video/generate-link', { appointment_id: appointmentId });

export const getGoogleMeetStatus = () => api.get('/video/google/status');
export const getGoogleMeetConnectUrl = () => api.post('/video/google/connect-url');
