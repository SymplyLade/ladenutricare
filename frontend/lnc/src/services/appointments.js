import api from './api';

export const getAppointments = () => api.get('/appointments/');
export const getAppointment = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments/', data);
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
