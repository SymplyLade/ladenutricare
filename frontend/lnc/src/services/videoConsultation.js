import api from './api';

export const generateVideoLink = (appointmentId) =>
  api.post('/video/generate-link', { appointment_id: appointmentId });
