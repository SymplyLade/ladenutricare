// import api from './api';

// export const getPatientTypes = () => api.get('/patient-types');
// export const getPatientType = (id) => api.get(`/patient-types/${id}`);
// export const getMealPlans = (patientTypeId) => api.get(`/meal-plans?patient_type_id=${patientTypeId}`);
// export const assignNutritionPlan = (planId) => api.post('/nutrition/assign', { plan_id: planId });
// export const getMyNutritionPlan = () => api.get('/nutrition/my-plan');



import api from './api';

export const getPatientTypes = () => api.get('/nutrition/patient-types');
export const getPatientType = (id) => api.get(`/nutrition/patient-types/${id}`);
export const getMealPlans = (patientTypeId) => api.get(`/nutrition/meal-plans?patient_type_id=${patientTypeId}`);
export const getMyNutritionPlan = () => api.get('/nutrition/my-plan');
export const assignNutritionPlan = (planId) => api.post('/nutrition/assign', { plan_id: planId });
export const createCustomNutritionPlan = (data) => api.post('/nutrition/custom-plan', data);

