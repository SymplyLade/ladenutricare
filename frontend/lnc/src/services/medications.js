import api from './api';

export const getMedications = () => api.get('/medications');
export const getMedicationSafetyReport = () => api.get('/medications/safety-report');
export const createMedication = (data) => api.post('/medications', data);
export const updateMedication = (id, data) => api.put(`/medications/${id}`, data);
export const deleteMedication = (id) => api.delete(`/medications/${id}`);
