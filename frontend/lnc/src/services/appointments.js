import api from './api';

export const getAppointments = () => api.get('/appointments/');
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments/', data);
export const respondToAppointmentAvailability = (id, available, consultation_format) =>
  api.patch(`/appointments/doctor/${id}/availability`, { available, consultation_format });
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}/permanent`);
export const markAppointmentSeen = (id) => api.patch(`/appointments/${id}/mark-seen`);
