import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { createAppointmentWithPayment } from '../services/appointments';
import { getVerifiedDoctors } from '../services/doctors';

const DEFAULT_SPECIALIZATION = 'General Medicine';

const normalizeSpecialization = (value) => {
  const text = String(value || '').trim();
  return text || DEFAULT_SPECIALIZATION;
};

const sortByName = (a, b) => String(a.name || '').localeCompare(String(b.name || ''));

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const symptomState = location.state || {};
  const autoDepartment = normalizeSpecialization(symptomState.department);
  const fromSymptom = Boolean(symptomState.fromSymptom);

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorLoadError, setDoctorLoadError] = useState('');
  const [formData, setFormData] = useState({
    department: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    payment_method: '',
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

  const matchedDoctors = useMemo(() => {
    if (!fromSymptom) return doctors;
    return doctors.filter((doctor) => normalizeSpecialization(doctor.specialization) === autoDepartment);
  }, [doctors, fromSymptom, autoDepartment]);

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

  const suggestedDoctors = useMemo(() => {
    return [...matchedDoctors].sort(
      (a, b) => (Number(a.consultation_fee) - Number(b.consultation_fee))
        || (Number(b.experience_years) - Number(a.experience_years))
        || sortByName(a, b)
    );
  }, [matchedDoctors]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => String(doctor.doctor_user_id) === String(formData.doctor_id)),
    [doctors, formData.doctor_id]
  );

  useEffect(() => {
    if (!fromSymptom || matchedDoctors.length === 0) return;
    const sorted = [...matchedDoctors].sort(
      (a, b) => (Number(a.consultation_fee) - Number(b.consultation_fee))
        || (Number(b.experience_years) - Number(a.experience_years))
    );
    const recommended = sorted[0];
    setFormData((prev) => ({
      ...prev,
      doctor_id: prev.doctor_id || String(recommended.doctor_user_id),
      department: prev.department || normalizeSpecialization(recommended.specialization),
      notes: prev.notes || symptomState.notes || '',
    }));
  }, [fromSymptom, matchedDoctors, symptomState.notes]);

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
      await createAppointmentWithPayment(formData);
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
      {fromSymptom && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-3 rounded mb-4">
          Auto-matching doctors for <span className="font-semibold">{autoDepartment}</span>.
          {matchedDoctors.length === 0 ? ' No exact specialist found, showing all available doctors.' : ''}
        </div>
      )}

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
            {fromSymptom && suggestedDoctors.length > 0 && (
              <optgroup label={`Suggested for ${autoDepartment}`}>
                {suggestedDoctors.map((doc) => (
                  <option key={`suggested-${doc.doctor_user_id}`} value={doc.doctor_user_id}>
                    Dr. {doc.name} (&#8358;{doc.consultation_fee})
                  </option>
                ))}
              </optgroup>
            )}
            {groupedDoctors.map(([specialization, list]) => (
              <optgroup key={specialization} label={specialization}>
                {list.map((doc) => (
                  <option key={doc.doctor_user_id} value={doc.doctor_user_id}>
                    Dr. {doc.name} (&#8358;{doc.consultation_fee})
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
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
            Payment Method *
          </label>
          <select
            name="payment_method"
            id="payment_method"
            required
            value={formData.payment_method}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select method</option>
            <option value="mastercard">Mastercard</option>
            <option value="visa">Visa</option>
            <option value="verve">Verve</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="ussd">USSD</option>
            <option value="wallet">Wallet</option>
          </select>
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
            {loading ? 'Processing Payment...' : 'Pay and Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
