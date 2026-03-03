import api from './api';

export const checkSymptoms = (data) => api.post('/symptoms/check', data);
export const getSymptomHistory = () => api.get('/symptoms');