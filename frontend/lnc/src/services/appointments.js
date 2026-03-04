import api from './api';

export const getAppointments = () => api.get('/appointments/');
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments/', data);
export const createAppointmentWithPayment = (data) => api.post('/appointments/with-payment', data);
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}/permanent`);
export const markAppointmentSeen = (id) => api.patch(`/appointments/${id}/mark-seen`);
