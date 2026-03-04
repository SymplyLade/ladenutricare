import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createCustomNutritionPlan, generateNutritionPlanFromTitle } from '../services/nutrition';

const LOCATION_OPTIONS = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United Kingdom',
  'United States',
  'Canada',
  'India',
  'Other',
];

const Nutrition = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  const [autoForm, setAutoForm] = useState({
    title: '',
    country: 'Nigeria',
    description: '',
  });
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const [autoMessage, setAutoMessage] = useState({ type: '', text: '' });

  const [customForm, setCustomForm] = useState({
    title: '',
    description: '',
    desired_meal_plan: '',
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customMessage, setCustomMessage] = useState({ type: '', text: '' });

  const handleAutoChange = (e) => {
    setAutoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAutoSubmit = async (e) => {
    e.preventDefault();
    setAutoMessage({ type: '', text: '' });

    if (autoForm.title.trim().length < 2) {
      setAutoMessage({ type: 'error', text: 'Please enter a valid title or condition.' });
      return;
    }
    if (autoForm.country.trim().length < 2) {
      setAutoMessage({ type: 'error', text: 'Please enter your country before generating.' });
      return;
    }

    setAutoSubmitting(true);
    try {
      await generateNutritionPlanFromTitle({
        title: autoForm.title.trim(),
        country: autoForm.country.trim(),
        description: autoForm.description.trim() || undefined,
      });
      setAutoMessage({
        type: 'success',
        text: 'Meal plan generated successfully. You can view it in My Nutrition Plan.',
      });
      setAutoForm({ title: '', country: 'Nigeria', description: '' });
      navigate('/my-nutrition-plan');
    } catch (err) {
      setAutoMessage({
        type: 'error',
        text: err.response?.data?.detail || err.response?.data?.error || 'Failed to generate meal plan.',
      });
    } finally {
      setAutoSubmitting(false);
    }
  };

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
        Enter any title or condition and generate a global meal plan instantly.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generate Meal Plan from Title</h2>
        <p className="text-gray-600 mb-4">
          Type any condition or goal (for example: fatigue, post-surgery, muscle gain), and a plan is generated dynamically.
        </p>

        {autoMessage.text && (
          <div
            className={`mb-4 px-4 py-3 rounded ${
              autoMessage.type === 'success'
                ? 'bg-green-100 border border-green-300 text-green-700'
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}
          >
            {autoMessage.text}
          </div>
        )}

        <form onSubmit={handleAutoSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="auto-title" className="block text-sm font-medium text-gray-700">
                Condition / Plan Title
              </label>
              <input
                id="auto-title"
                name="title"
                type="text"
                value={autoForm.title}
                onChange={handleAutoChange}
                placeholder="e.g., fatigue recovery"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="auto-country" className="block text-sm font-medium text-gray-700">
                Country / Region
              </label>
              <select
                id="auto-country"
                name="country"
                value={autoForm.country}
                onChange={handleAutoChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="auto-description" className="block text-sm font-medium text-gray-700">
              Optional Description
            </label>
            <input
              id="auto-description"
              name="description"
              type="text"
              value={autoForm.description}
              onChange={handleAutoChange}
              placeholder="Optional note for this plan"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              disabled={autoSubmitting}
              className="inline-flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {autoSubmitting ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>

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
    </div>
  );
};

export default Nutrition;
