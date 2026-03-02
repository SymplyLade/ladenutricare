// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getPatientTypes } from '../services/nutrition';

// const patientTypeIcons = {
//   diabetes: 'https://img.icons8.com/color/96/diabetes.png',
//   pregnancy: 'https://img.icons8.com/color/96/pregnancy.png',
//   cramps: 'https://img.icons8.com/color/96/cramps.png',
//   hypertension: 'https://img.icons8.com/color/96/hypertension.png',
//   obesity: 'https://img.icons8.com/color/96/obesity.png',
//   // default fallback
//   default: 'https://img.icons8.com/color/96/healthy-eating.png',
// };

// const Nutrition = () => {
//   const [patientTypes, setPatientTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchPatientTypes = async () => {
//       try {
//         const response = await getPatientTypes();
//         setPatientTypes(response.data);
//       } catch (err) {
//         setError('Failed to load nutrition plans');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPatientTypes();
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Plans</h1>
//       <p className="text-gray-600 mb-8">
//         Select your health condition to get personalized meal plans and dietary advice.
//       </p>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {patientTypes.map((type) => (
//           <Link
//             key={type.id}
//             to={`/nutrition/${type.id}`}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
//           >
//             <img
//               src={patientTypeIcons[type.name.toLowerCase()] || patientTypeIcons.default}
//               alt={type.name}
//               className="w-24 h-24 mb-4"
//             />
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.name}</h3>
//             <p className="text-gray-600 line-clamp-3">{type.description}</p>
//             <span className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
//               View advice & meals →
//             </span>
//           </Link>
//         ))}
//       </div>

//       {patientTypes.length === 0 && (
//         <div className="text-center py-12 bg-white rounded-lg shadow">
//           <p className="text-gray-500">No nutrition plans available at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Nutrition;



// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// // Mock data
// const mockPatientTypes = [
//   {
//     id: 1,
//     name: 'Diabetes',
//     description: 'Manage blood sugar levels with proper diet.',
//     general_advice: 'Avoid sugary foods, eat whole grains, and monitor carbs.'
//   },
//   {
//     id: 2,
//     name: 'Pregnancy',
//     description: 'Nutrition for a healthy pregnancy.',
//     general_advice: 'Increase folic acid, iron, and calcium. Stay hydrated.'
//   },
//   {
//     id: 3,
//     name: 'Hypertension',
//     description: 'Control blood pressure with a balanced diet.',
//     general_advice: 'Reduce sodium intake, eat potassium-rich foods, and limit alcohol.'
//   },
//   {
//     id: 4,
//     name: 'Cramps',
//     description: 'Ease muscle cramps with proper nutrition.',
//     general_advice: 'Stay hydrated, eat magnesium-rich foods like bananas and nuts.'
//   },
//   {
//     id: 5,
//     name: 'Obesity',
//     description: 'Achieve healthy weight with portion control and balanced meals.',
//     general_advice: 'Focus on whole foods, avoid processed snacks, and exercise regularly.'
//   }
// ];

// const Nutrition = () => {
//   const [patientTypes, setPatientTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setPatientTypes(mockPatientTypes);
//       setLoading(false);
//     }, 800);
//   }, []);

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Nutrition & Meal Planning</h1>
//       <p className="text-gray-600 mb-8">Select your health condition to get personalized dietary advice and meal plans.</p>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {patientTypes.map((type) => (
//           <Link
//             key={type.id}
//             to={`/nutrition/${type.id}`}
//             className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
//           >
//             <div className="p-6 flex flex-col items-center text-center">
//               <img
//                 src={`https://img.icons8.com/color/96/nutrition.png`}
//                 alt={type.name}
//                 className="w-24 h-24 mb-4"
//               />
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.name}</h3>
//               <p className="text-gray-600 line-clamp-3">{type.description}</p>
//               <span className="mt-4 text-indigo-600 font-medium">View details →</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Nutrition;




import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import local images
import diabetesImg from '../assets/diabetes.jpg';
import pregnancyImg from '../assets/pregnancy.jpg';
import hypertensionImg from '../assets/hypertension.jpg';
import crampsImg from '../assets/cramps.jpg';
import obesityImg from '../assets/obesity.jpg';

// Mock data
const mockPatientTypes = [
  {
    id: 1,
    name: 'Diabetes',
    description: 'Manage blood sugar levels with proper diet.',
    general_advice: 'Avoid sugary foods, eat whole grains, and monitor carbs.',
    image: diabetesImg,
  },
  {
    id: 2,
    name: 'Pregnancy',
    description: 'Nutrition for a healthy pregnancy.',
    general_advice: 'Increase folic acid, iron, and calcium. Stay hydrated.',
    image: pregnancyImg,
  },
  {
    id: 3,
    name: 'Hypertension',
    description: 'Control blood pressure with a balanced diet.',
    general_advice: 'Reduce sodium intake, eat potassium-rich foods, and limit alcohol.',
    image: hypertensionImg,
  },
  {
    id: 4,
    name: 'Cramps',
    description: 'Ease muscle cramps with proper nutrition.',
    general_advice: 'Stay hydrated, eat magnesium-rich foods like bananas and nuts.',
    image: crampsImg,
  },
  {
    id: 5,
    name: 'Obesity',
    description: 'Achieve healthy weight with portion control and balanced meals.',
    general_advice: 'Focus on whole foods, avoid processed snacks, and exercise regularly.',
    image: obesityImg,
  },
];

const Nutrition = () => {
  const [patientTypes, setPatientTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatientTypes(mockPatientTypes);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition & Meal Planning</h1>
      <p className="text-gray-600 mb-8">
        Select your health condition to get personalized dietary advice and meal plans.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientTypes.map((type) => (
          <Link
            key={type.id}
            to={`/nutrition/${type.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-indigo-100 group-hover:border-indigo-300 transition-colors">
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.name}</h3>
              <p className="text-gray-600 line-clamp-3">{type.description}</p>
              <span className="mt-4 text-indigo-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                View details →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nutrition;