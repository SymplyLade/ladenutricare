import { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router-dom';
import { assignNutritionPlan, getMealPlans, getPatientType } from '../services/nutrition';

const PatientTypeDetail = () => {
  const { patientTypeId } = useParams();
  const [patientType, setPatientType] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typeRes, planRes] = await Promise.all([
          getPatientType(patientTypeId),
          getMealPlans(patientTypeId),
        ]);
        setPatientType(typeRes.data);
        setMealPlans(planRes.data);
      } catch (err) {
        setError('Failed to load nutrition details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientTypeId]);

  const handleAssign = async (planId) => {
    try {
      await assignNutritionPlan(planId);
      alert('Nutrition plan set successfully.');
    } catch (err) {
      alert('Failed to set nutrition plan.');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !patientType) {
    return <div className="max-w-7xl mx-auto py-8 px-4 text-red-500">{error || 'Patient type not found'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav className="flex mb-6 text-sm">
        <Link to="/nutrition" className="text-indigo-600 hover:text-indigo-500">Nutrition</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{patientType.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{patientType.name}</h1>
        <p className="text-gray-600 mb-6">{patientType.description}</p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Advice</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <div className="flex">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
            <p className="text-gray-700">{patientType.general_advice}</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Meal Plans</h2>
        {mealPlans.length === 0 ? (
          <p className="text-gray-500">No meal plans available for this condition yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="space-y-3">
                  {Object.entries(plan.meals || {}).map(([mealTime, items]) => (
                    <div key={mealTime}>
                      <h4 className="font-medium text-gray-700 capitalize">{mealTime}</h4>
                      <ul className="list-disc list-inside text-gray-600 ml-2">
                        {Array.isArray(items) && items.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleAssign(plan.id)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Set as my plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTypeDetail;
