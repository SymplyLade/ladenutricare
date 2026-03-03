import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createCustomNutritionPlan, getPatientTypes } from '../services/nutrition';
import diabetesImg from '../assets/diabetes.jpg';
import pregnancyImg from '../assets/pregnancy.jpg';
import hypertensionImg from '../assets/hypertension.jpg';
import crampsImg from '../assets/cramps.jpg';
import obesityImg from '../assets/obesity.jpg';
import logoImg from '../assets/lnc-logo.svg';

const imageByType = {
  diabetes: diabetesImg,
  pregnancy: pregnancyImg,
  hypertension: hypertensionImg,
  cramps: crampsImg,
  obesity: obesityImg,
};

const fallbackImg = logoImg;

const getTypeImage = (typeName = '') => {
  const normalized = typeName.toLowerCase().trim();
  if (imageByType[normalized]) return imageByType[normalized];
  if (normalized.includes('diabet')) return diabetesImg;
  if (normalized.includes('pregnan')) return pregnancyImg;
  if (normalized.includes('hyperten')) return hypertensionImg;
  if (normalized.includes('cramp')) return crampsImg;
  if (normalized.includes('obes')) return obesityImg;
  return fallbackImg;
};

const Nutrition = () => {
  const [patientTypes, setPatientTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customForm, setCustomForm] = useState({
    title: '',
    description: '',
    desired_meal_plan: '',
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customMessage, setCustomMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchPatientTypes = async () => {
      try {
        const response = await getPatientTypes();
        setPatientTypes(response.data);
      } catch (err) {
        setError('Failed to load nutrition plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientTypes();
  }, []);

  const handleCustomChange = (e) => {
    setCustomForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setCustomMessage({ type: '', text: '' });

    if (customForm.desired_meal_plan.trim().length < 10) {
      setCustomMessage({ type: 'error', text: 'Please provide more detail about your desired meal plan.' });
      return;
    }

    setCustomSubmitting(true);
    try {
      await createCustomNutritionPlan({
        title: customForm.title || 'My Custom Meal Plan',
        description: customForm.description || 'User-defined meal plan',
        desired_meal_plan: customForm.desired_meal_plan.trim(),
      });
      setCustomMessage({ type: 'success', text: 'Custom meal plan saved. You can view it in My Nutrition Plan.' });
      setCustomForm({ title: '', description: '', desired_meal_plan: '' });
    } catch (err) {
      setCustomMessage({
        type: 'error',
        text: err.response?.data?.detail || err.response?.data?.error || 'Failed to save custom meal plan.',
      });
    } finally {
      setCustomSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nutrition and Meal Planning</h1>
      <p className="text-gray-600 mb-8">
        Select your health condition to get personalized dietary advice and meal plans.
      </p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tell Us the Meal Plan You Want</h2>
        <p className="text-gray-600 mb-4">
          If you already know what meals you want, write it here and save it as your active nutrition plan.
        </p>

        {customMessage.text && (
          <div
            className={`mb-4 px-4 py-3 rounded ${
              customMessage.type === 'success'
                ? 'bg-green-100 border border-green-300 text-green-700'
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}
          >
            {customMessage.text}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Plan Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={customForm.title}
                onChange={handleCustomChange}
                placeholder="e.g., My Weekly Healthy Plan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={customForm.description}
                onChange={handleCustomChange}
                placeholder="e.g., Low carb with high protein"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="desired_meal_plan" className="block text-sm font-medium text-gray-700">
              Desired Meal Plan
            </label>
            <textarea
              id="desired_meal_plan"
              name="desired_meal_plan"
              rows={5}
              value={customForm.desired_meal_plan}
              onChange={handleCustomChange}
              placeholder="Write your preferred breakfast, lunch, dinner, snacks, and any restrictions..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Link
              to="/my-nutrition-plan"
              className="inline-flex justify-center items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View My Nutrition Plan
            </Link>
            <button
              type="submit"
              disabled={customSubmitting}
              className="inline-flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {customSubmitting ? 'Saving...' : 'Save Custom Plan'}
            </button>
          </div>
        </form>
      </div>

      {patientTypes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No nutrition plans available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientTypes.map((type) => {
            const image = getTypeImage(type.name || '');
            return (
              <Link
                key={type.id}
                to={`/nutrition/${type.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-indigo-100 group-hover:border-indigo-300 transition-colors">
                    <img src={image} alt={type.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.name}</h3>
                  <p className="text-gray-600 line-clamp-3">{type.description}</p>
                  <span className="mt-4 text-indigo-600 font-medium">View details</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Nutrition;
