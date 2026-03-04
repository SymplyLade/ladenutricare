import api from './api';

export const getPatientTypes = () => api.get('/nutrition/patient-types');
export const getPatientType = (id) => api.get(`/nutrition/patient-types/${id}`);
export const getMealPlans = (patientTypeId) => api.get(`/nutrition/meal-plans?patient_type_id=${patientTypeId}`);
export const getMyNutritionPlan = () => api.get('/nutrition/my-plan');
export const deleteMyNutritionPlan = () => api.delete('/nutrition/my-plan');
export const assignNutritionPlan = (planId) => api.post('/nutrition/assign', { plan_id: planId });
export const createCustomNutritionPlan = (data) => api.post('/nutrition/custom-plan', data);
export const generateNutritionPlanFromTitle = async (data) => {
  const endpoints = [
    '/nutrition/generate-from-title',
    '/nutrition/generate',
    '/nutrition/generate_from_title',
  ];

  let lastError;
  for (const path of endpoints) {
    try {
      return await api.post(path, data);
    } catch (error) {
      lastError = error;
      if (error?.response?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
};
