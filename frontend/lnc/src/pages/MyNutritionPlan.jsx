import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyNutritionPlan } from '../services/nutrition';

const MyNutritionPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPlan = async () => {
      try {
        const response = await getMyNutritionPlan();
        setPlan(response.data);
      } catch (err) {
        setError('You have not selected a nutrition plan yet.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPlan();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (error || !plan) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Nutrition Plan</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link to="/nutrition" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
          Browse Nutrition Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Nutrition Plan</h1>
      <p className="text-gray-600 mb-6">For: {plan.patient_type_name}</p>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{plan.title}</h2>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        <div className="space-y-6">
          {Object.entries(plan.meals || {}).map(([mealTime, items]) => (
            <div key={mealTime}>
              <h3 className="text-lg font-medium text-gray-800 capitalize border-b pb-2 mb-3">{mealTime}</h3>
              <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                {Array.isArray(items) && items.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Link to="/nutrition" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Change plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyNutritionPlan;
