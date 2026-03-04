import api from './api';

export const initializePayment = (data) => api.post('/payments/initialize', data);
export const completePayment = (paymentId, data) => api.post(`/payments/complete/${paymentId}`, data || {});
export const getMyPayments = () => api.get('/payments/my');
