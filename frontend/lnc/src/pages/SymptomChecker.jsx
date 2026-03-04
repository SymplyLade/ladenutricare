// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { checkSymptoms } from '../services/symptom';

// const SymptomChecker = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     symptoms: '',
//     duration: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [result, setResult] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setResult(null);
//     try {
//       const response = await checkSymptoms(formData);
//       setResult(response.data);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Symptom Checker</h1>
//       <p className="text-gray-600 mb-4">
//         Describe your symptoms and their duration. Our AI will analyze them and provide recommendations.
//       </p>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
//         <div>
//           <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
//             Symptoms *
//           </label>
//           <textarea
//             id="symptoms"
//             name="symptoms"
//             rows={4}
//             required
//             value={formData.symptoms}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             placeholder="e.g., headache, fever, cough..."
//           />
//         </div>

//         <div>
//           <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
//             Duration *
//           </label>
//           <input
//             type="text"
//             name="duration"
//             id="duration"
//             required
//             value={formData.duration}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             placeholder="e.g., 2 days, 1 week"
//           />
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading}
//             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {loading ? 'Analyzing...' : 'Check Symptoms'}
//           </button>
//         </div>
//       </form>

//       {result && (
//         <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
//           <h2 className="text-xl font-medium text-gray-900 mb-4">Analysis Results</h2>

//           <div className="space-y-4">
//             <div>
//               <span className="font-medium text-gray-700">Recommended Department:</span>{' '}
//               <span className="text-indigo-600">{result.recommended_department}</span>
//             </div>

//             <div>
//               <span className="font-medium text-gray-700">Urgency Level:</span>{' '}
//               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                 result.urgency_level === 'high' ? 'bg-red-100 text-red-800' :
//                 result.urgency_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                 'bg-green-100 text-green-800'
//               }`}>
//                 {result.urgency_level}
//               </span>
//             </div>

//             <div>
//               <span className="font-medium text-gray-700">Analysis:</span>
//               <p className="mt-1 text-gray-600">{result.analysis}</p>
//             </div>

//             {result.advice && (
//               <div>
//                 <span className="font-medium text-gray-700">Advice:</span>
//                 <p className="mt-1 text-gray-600">{result.advice}</p>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 flex space-x-3">
//             <button
//               onClick={() => navigate('/appointments/new', {
//                 state: {
//                   department: result.recommended_department,
//                   notes: `Symptoms: ${formData.symptoms} (${formData.duration})`
//                 }
//               })}
//               className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
//             >
//               Book Appointment
//             </button>
//             <button
//               onClick={() => setResult(null)}
//               className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//             >
//               Check Again
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SymptomChecker;



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSymptoms, submitSymptomFollowUp } from '../services/symptoms';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpResult, setFollowUpResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setFollowUpResult(null);
    try {
      const response = await checkSymptoms(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async (status) => {
    setFollowUpLoading(true);
    try {
      const response = await submitSymptomFollowUp({ status });
      setFollowUpResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit follow-up.');
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Symptom Checker</h1>
      <p className="text-gray-600 mb-4">
        Describe your symptoms and their duration. Our AI will analyze them and provide recommendations.
      </p>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms *</label>
          <textarea
            id="symptoms"
            name="symptoms"
            rows={4}
            required
            value={formData.symptoms}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., headache, fever, cough..."
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration *</label>
          <input
            type="text"
            name="duration"
            id="duration"
            required
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 2 days, 1 week"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>
        </div>
      </form>
      {result && (
        <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Analysis Results</h2>
          {result.emergency_flag && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
              Emergency signal detected. Seek urgent care immediately.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700">Recommended Department:</span>{' '}
              <span className="text-indigo-600">{result.recommended_department}</span>
            </div>
            {result.doctor_type && (
              <div>
                <span className="font-medium text-gray-700">Doctor Type Needed:</span>{' '}
                <span className="text-indigo-600">{result.doctor_type}</span>
              </div>
            )}
            {result.confidence && (
              <div>
                <span className="font-medium text-gray-700">Confidence:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  result.confidence === 'high' ? 'bg-green-100 text-green-800' :
                  result.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {result.confidence}
                </span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Urgency Level:</span>{' '}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                result.urgency_level === 'high' ? 'bg-red-100 text-red-800' :
                result.urgency_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {result.urgency_level}
              </span>
            </div>
            {Array.isArray(result.matched_keywords) && result.matched_keywords.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Matched Symptoms:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.matched_keywords.map((kw, idx) => (
                    <span key={`${kw}-${idx}`} className="px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Analysis:</span>
              <p className="mt-1 text-gray-600">{result.analysis}</p>
            </div>
            {result.advice && (
              <div>
                <span className="font-medium text-gray-700">Advice:</span>
                <p className="mt-1 text-gray-600">{result.advice}</p>
              </div>
            )}
            {Array.isArray(result.next_steps) && result.next_steps.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Next Steps:</span>
                <ul className="mt-1 list-disc list-inside text-gray-600 space-y-1">
                  {result.next_steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => navigate('/appointments/new', {
                state: {
                  department: result.recommended_department,
                  doctorType: result.doctor_type,
                  urgency: result.urgency_level,
                  fromSymptom: true,
                  notes: `Symptoms: ${formData.symptoms} (${formData.duration})`
                }
              })}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Book Appointment
            </button>
            <button
              onClick={() => setResult(null)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Check Again
            </button>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">How do you feel after initial advice?</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={followUpLoading}
                onClick={() => handleFollowUp('better')}
                className="px-3 py-2 rounded-md text-sm bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
              >
                Better
              </button>
              <button
                type="button"
                disabled={followUpLoading}
                onClick={() => handleFollowUp('same')}
                className="px-3 py-2 rounded-md text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50"
              >
                Same
              </button>
              <button
                type="button"
                disabled={followUpLoading}
                onClick={() => handleFollowUp('worse')}
                className="px-3 py-2 rounded-md text-sm bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
              >
                Worse
              </button>
            </div>
            {followUpResult && (
              <div className="mt-3 rounded-md border border-indigo-200 bg-indigo-50 p-3">
                <p className="text-sm text-indigo-800 font-medium">{followUpResult.message}</p>
                <p className="text-sm text-indigo-700 mt-1">Next action: {followUpResult.next_action}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
