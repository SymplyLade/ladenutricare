import api from './api';

export const documentConsultation = (appointmentId, data) =>
  api.post(`/consultations/${appointmentId}/document`, data);

export const getConsultationDocuments = (appointmentId) =>
  api.get(`/consultations/${appointmentId}`);

export const completeDoctorTask = (taskId, isCompleted = true) =>
  api.patch(`/consultations/tasks/${taskId}/complete`, { is_completed: isCompleted });
