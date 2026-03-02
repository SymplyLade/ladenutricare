import api from './api';

// Users
export const getAllUsers = () => api.get('/admin/users');
export const updateUser = (userId, data) => api.put(`/admin/users/${userId}`, data);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Doctors
export const getAllDoctors = () => api.get('/admin/doctors');
export const verifyDoctor = (doctorId) => api.post(`/admin/doctors/${doctorId}/verify`);
export const updateDoctor = (doctorId, data) => api.put(`/admin/doctors/${doctorId}`, data);

// Appointments
export const getAllAppointments = () => api.get('/admin/appointments');
export const updateAppointmentStatus = (appointmentId, status) => 
  api.patch(`/admin/appointments/${appointmentId}`, { status });

// Payments
export const getAllPayments = () => api.get('/admin/payments');
export const refundPayment = (paymentId) => api.post(`/admin/payments/${paymentId}/refund`);

// Nutrition (Patient Types & Meal Plans)
export const getAllPatientTypes = () => api.get('/admin/patient-types');
export const createPatientType = (data) => api.post('/admin/patient-types', data);
export const updatePatientType = (id, data) => api.put(`/admin/patient-types/${id}`, data);
export const deletePatientType = (id) => api.delete(`/admin/patient-types/${id}`);

export const getAllMealPlans = () => api.get('/admin/meal-plans');
export const createMealPlan = (data) => api.post('/admin/meal-plans', data);
export const updateMealPlan = (id, data) => api.put(`/admin/meal-plans/${id}`, data);
export const deleteMealPlan = (id) => api.delete(`/admin/meal-plans/${id}`);

// Dashboard Stats
export const getDashboardStats = () => api.get('/admin/stats');