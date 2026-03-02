import { useState, useEffect } from 'react';
import { getAllDoctors, verifyDoctor, updateDoctor } from '../../services/admin';
import { CheckCircleIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyDoctor(id);
      setDoctors(doctors.map(d => d.id === id ? { ...d, is_verified: true } : d));
    } catch (err) {
      setError('Failed to verify doctor');
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setEditForm(doctor);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    try {
      await updateDoctor(id, editForm);
      setDoctors(doctors.map(d => d.id === id ? { ...d, ...editForm } : d));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update doctor');
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Doctors</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingId === doctor.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    doctor.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === doctor.id ? (
                    <input
                      type="text"
                      name="specialization"
                      value={editForm.specialization || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    doctor.specialization
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.license_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === doctor.id ? (
                    <input
                      type="number"
                      name="experience_years"
                      value={editForm.experience_years || ''}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-20"
                    />
                  ) : (
                    `${doctor.experience_years} years`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {doctor.is_verified ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircleIcon className="h-5 w-5 mr-1" /> Not Verified
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === doctor.id ? (
                    <>
                      <button
                        onClick={() => handleSave(doctor.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {!doctor.is_verified && (
                        <button
                          onClick={() => handleVerify(doctor.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;