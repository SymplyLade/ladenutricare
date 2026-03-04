import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { generateNutritionPlanFromTitle } from '../services/nutrition';

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

const PatientTypeDetail = () => {
  const { patientTypeId } = useParams();
  const navigate = useNavigate();
  const conditionTitle = useMemo(
    () => decodeURIComponent(String(patientTypeId || '')).trim(),
    [patientTypeId]
  );

  const [country, setCountry] = useState('Nigeria');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!conditionTitle) {
      setError('Condition is missing.');
      return;
    }
    if (country.trim().length < 2) {
      setError('Please enter your country before generating.');
      return;
    }

    setLoading(true);
    try {
      await generateNutritionPlanFromTitle({
        title: conditionTitle,
        country: country.trim(),
        description: `Generated from condition: ${conditionTitle}`,
      });
      navigate('/my-nutrition-plan', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate meal plan from condition.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Meal Plan</h1>
        <p className="text-gray-600 mb-6">
          Condition: <span className="font-semibold text-gray-800">{conditionTitle || 'N/A'}</span>
        </p>

        {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3">{error}</div>}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country / Region
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
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

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link
              to="/nutrition"
              className="inline-flex items-center justify-center bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientTypeDetail;
