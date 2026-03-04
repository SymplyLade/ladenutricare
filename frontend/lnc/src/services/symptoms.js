import api from './api';

export const checkSymptoms = (data) => api.post('/symptoms/check', data);
export const getSymptomHistory = () => api.get('/symptoms');
export const submitSymptomFollowUp = (data) => api.post('/symptoms/follow-up', data);
