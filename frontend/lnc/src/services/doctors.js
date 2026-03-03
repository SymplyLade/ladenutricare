import api from './api';

export const getVerifiedDoctors = () => api.get('/doctors');