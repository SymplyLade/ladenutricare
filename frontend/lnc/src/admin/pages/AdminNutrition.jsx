import { useState, useEffect } from 'react';
import {
  getAllPatientTypes,
  createPatientType,
  updatePatientType,
  deletePatientType,
  getAllMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from '../../services/admin';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminNutrition = () => {
  const [activeTab, setActiveTab] = useState('patientTypes');
  const [patientTypes, setPatientTypes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    general_advice: '',
    title: '',
    meals: { breakfast: [], lunch: [], dinner: [] },
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'patientTypes') {
        const response = await getAllPatientTypes();
        setPatientTypes(response.data);
      } else {
        const response = await getAllMealPlans();
        setMealPlans(response.data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMealChange = (mealTime, index, value) => {
    const newMeals = { ...formData.meals };
    newMeals[mealTime][index] = value;
    setFormData({ ...formData, meals: newMeals });
  };

  const addMealItem = (mealTime) => {
    const newMeals = { ...formData.meals };
    newMeals[mealTime].push('');
    setFormData({ ...formData, meals: newMeals });
  };

  const removeMealItem = (mealTime, index) => {
    const newMeals = { ...formData.meals };
    newMeals[mealTime].splice(index, 1);
    setFormData({ ...formData, meals: newMeals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'patientTypes') {
        if (editingId) {
          await updatePatientType(editingId, formData);
          setPatientTypes(patientTypes.map(pt => pt.id === editingId ? { ...pt, ...formData } : pt));
        } else {
          const response = await createPatientType(formData);
          setPatientTypes([...patientTypes, response.data]);
        }
      } else {
        if (editingId) {
          await updateMealPlan(editingId, formData);
          setMealPlans(mealPlans.map(mp => mp.id === editingId ? { ...mp, ...formData } : mp));
        } else {
          const response = await createMealPlan(formData);
          setMealPlans([...mealPlans, response.data]);
        }
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', general_advice: '', title: '', meals: { breakfast: [], lunch: [], dinner: [] } });
    } catch (err) {
      setError('Failed to save');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      if (activeTab === 'patientTypes') {
        await deletePatientType(id);
        setPatientTypes(patientTypes.filter(pt => pt.id !== id));
      } else {
        await deleteMealPlan(id);
        setMealPlans(mealPlans.filter(mp => mp.id !== id));
      }
    } catch (err) {
      setError('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('patientTypes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'patientTypes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Patient Types
          </button>
          <button
            onClick={() => setActiveTab('mealPlans')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mealPlans'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meal Plans
          </button>
        </nav>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {activeTab === 'patientTypes' ? 'Manage Patient Types' : 'Manage Meal Plans'}
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', description: '', general_advice: '', title: '', meals: { breakfast: [], lunch: [], dinner: [] } });
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit' : 'New'} {activeTab === 'patientTypes' ? 'Patient Type' : 'Meal Plan'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'patientTypes' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">General Advice</label>
                  <textarea
                    name="general_advice"
                    rows={3}
                    value={formData.general_advice}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient Type ID (for now)</label>
                  <input
                    type="number"
                    name="patient_type_id"
                    value={formData.patient_type_id || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meals</label>
                  {['breakfast', 'lunch', 'dinner'].map((mealTime) => (
                    <div key={mealTime} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 capitalize mb-1">{mealTime}</h4>
                      {formData.meals[mealTime]?.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleMealChange(mealTime, idx, e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={`${mealTime} item`}
                          />
                          <button
                            type="button"
                            onClick={() => removeMealItem(mealTime, idx)}
                            className="text-red-600 hover:text-red-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addMealItem(mealTime)}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        + Add item
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(activeTab === 'patientTypes' ? patientTypes : mealPlans).map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {activeTab === 'patientTypes' ? item.name : item.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminNutrition;