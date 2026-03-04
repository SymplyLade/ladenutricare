import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteMyNutritionPlan, getMyNutritionPlan } from '../services/nutrition';

const weeks = ['week_1', 'week_2', 'week_3', 'week_4'];
const days = ['day_1', 'day_2', 'day_3', 'day_4', 'day_5', 'day_6', 'day_7'];
const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'];

const pretty = (value = '') => value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeMeals = (meals) => {
  if (!meals) return {};
  if (typeof meals === 'string') {
    try {
      return JSON.parse(meals);
    } catch {
      return {};
    }
  }
  return typeof meals === 'object' ? meals : {};
};

const toMonthlyShape = (meals) => {
  const normalized = normalizeMeals(meals);
  const hasWeekly = weeks.some((w) => normalized[w] && typeof normalized[w] === 'object');
  if (hasWeekly) return normalized;

  const dayTemplate = {
    breakfast: Array.isArray(normalized.breakfast) ? normalized.breakfast : ['Breakfast option 1', 'Breakfast option 2'],
    lunch: Array.isArray(normalized.lunch) ? normalized.lunch : ['Lunch option 1', 'Lunch option 2'],
    snack: Array.isArray(normalized.snack)
      ? normalized.snack
      : (Array.isArray(normalized.snacks) ? normalized.snacks : ['Snack option 1', 'Snack option 2']),
    dinner: Array.isArray(normalized.dinner) ? normalized.dinner : ['Dinner option 1', 'Dinner option 2'],
  };

  const monthly = {};
  weeks.forEach((week) => {
    monthly[week] = {};
    days.forEach((day) => {
      monthly[week][day] = { ...dayTemplate };
    });
  });
  monthly.notes = Array.isArray(normalized.notes) ? normalized.notes : [];
  return monthly;
};

const MyNutritionPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('week_1');
  const [selectedDay, setSelectedDay] = useState('day_1');

  useEffect(() => {
    const fetchMyPlan = async () => {
      try {
        const response = await getMyNutritionPlan();
        setPlan(response.data);
      } catch {
        setError('You have not selected a nutrition plan yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPlan();
  }, []);

  const handleDeletePlan = async () => {
    if (!window.confirm('Are you sure you want to delete your active nutrition plan?')) return;
    setDeleting(true);
    try {
      await deleteMyNutritionPlan();
      setPlan(null);
      setError('You have not selected a nutrition plan yet.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete nutrition plan.');
    } finally {
      setDeleting(false);
    }
  };

  const monthlyMeals = useMemo(() => toMonthlyShape(plan?.meals), [plan?.meals]);
  const selectedMeals = monthlyMeals?.[selectedWeek]?.[selectedDay] || {};

  if (loading) return <div className="text-center py-10">Loading...</div>;

  if (error || !plan) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Nutrition Plan</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link to="/nutrition" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Browse Nutrition Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 text-white p-6 sm:p-8 shadow-lg mb-6">
        <p className="text-indigo-100 text-sm mb-2">Monthly Nigerian Meal Guide</p>
        <h1 className="text-3xl font-bold mb-2">My Nutrition Plan</h1>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/30 text-sm font-medium">
          For: {plan.patient_type_name}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{plan.title}</h2>
        <p className="text-gray-600 mb-6">{plan.description}</p>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Week</p>
          <div className="flex flex-wrap gap-2">
            {weeks.map((week) => (
              <button
                key={week}
                type="button"
                onClick={() => setSelectedWeek(week)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedWeek === week
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-700'
                }`}
              >
                {pretty(week)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Day</p>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
                }`}
              >
                {pretty(day)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealOrder.map((mealType) => {
            const items = selectedMeals?.[mealType] ?? (mealType === 'snack' ? selectedMeals?.snacks : undefined);
            return (
            <div key={mealType} className="rounded-xl border bg-gradient-to-br from-slate-50 to-sky-50 border-slate-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">{pretty(mealType)}</h3>
              <ul className="space-y-2">
                {Array.isArray(items) && items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 bg-white/90 border border-white rounded-lg px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>

        {Array.isArray(monthlyMeals.notes) && monthlyMeals.notes.length > 0 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Notes</h3>
            <ul className="space-y-1">
              {monthlyMeals.notes.map((note, idx) => (
                <li key={idx} className="text-sm text-amber-800">{note}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={handleDeletePlan}
            disabled={deleting}
            className="inline-flex justify-center items-center bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete Plan'}
          </button>
          <Link
            to="/nutrition"
            className="inline-flex justify-center items-center px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Change plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyNutritionPlan;
