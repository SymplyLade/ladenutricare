import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAppointment } from '../services/appointments';
import { getVerifiedDoctors } from '../services/doctors';

const DEFAULT_SPECIALIZATION = 'General Medicine';

const normalizeSpecialization = (value) => {
  const text = String(value || '').trim();
  return text || DEFAULT_SPECIALIZATION;
};

const sortByName = (a, b) => String(a.name || '').localeCompare(String(b.name || ''));

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorLoadError, setDoctorLoadError] = useState('');
  const [formData, setFormData] = useState({
    department: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setDoctorLoadError('');
    setLoadingDoctors(true);
    try {
      const response = await getVerifiedDoctors();
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setDoctorLoadError(err.response?.data?.detail || err.response?.data?.error || 'Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const groupedDoctors = useMemo(() => {
    const groups = {};
    doctors.forEach((doctor) => {
      const specialization = normalizeSpecialization(doctor.specialization);
      if (!groups[specialization]) {
        groups[specialization] = [];
      }
      groups[specialization].push(doctor);
    });

    return Object.entries(groups)
      .map(([specialization, list]) => [specialization, [...list].sort(sortByName)])
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [doctors]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => String(doctor.doctor_user_id) === String(formData.doctor_id)),
    [doctors, formData.doctor_id]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'doctor_id') {
        const doctor = doctors.find((doc) => String(doc.doctor_user_id) === value);
        next.department = normalizeSpecialization(doctor?.specialization);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createAppointment(formData);
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const hasDoctors = doctors.length > 0;
  const disableSubmit = loading || loadingDoctors || !hasDoctors;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book New Appointment</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {doctorLoadError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{doctorLoadError}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
          <select
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange}
            required
            disabled={loadingDoctors || !hasDoctors}
            className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingDoctors ? 'Loading doctors...' : hasDoctors ? 'Choose a doctor' : 'No verified doctors available'}
            </option>
            {groupedDoctors.map(([specialization, list]) => (
              <optgroup key={specialization} label={specialization}>
                {list.map((doc) => (
                  <option key={doc.doctor_user_id} value={doc.doctor_user_id}>
                    Dr. {doc.name} (${doc.consultation_fee})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {!loadingDoctors && !hasDoctors && (
            <p className="mt-2 text-sm text-gray-600">
              No verified doctors available right now. Please try again later.
            </p>
          )}
          {selectedDoctor && (
            <p className="mt-2 text-sm text-gray-600">
              Specialist: <span className="font-medium text-gray-800">{normalizeSpecialization(selectedDoctor.specialization)}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input
            type="text"
            name="department"
            id="department"
            value={formData.department}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-700 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              name="appointment_date"
              id="appointment_date"
              required
              min={today}
              value={formData.appointment_date}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700">
              Time *
            </label>
            <input
              type="time"
              name="appointment_time"
              id="appointment_time"
              required
              value={formData.appointment_time}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={disableSubmit}
            className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
