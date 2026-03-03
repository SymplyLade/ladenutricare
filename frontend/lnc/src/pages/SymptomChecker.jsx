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
import { checkSymptoms } from '../services/symptoms';

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await checkSymptoms(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
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
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700">Recommended Department:</span>{' '}
              <span className="text-indigo-600">{result.recommended_department}</span>
            </div>
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
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => navigate('/appointments/new', {
                state: {
                  department: result.recommended_department,
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
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;