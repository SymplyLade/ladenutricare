// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { getPatientType, getMealPlans } from '../services/nutrition';
// import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// const PatientTypeDetail = () => {
//   const { patientTypeId } = useParams();
//   const [patientType, setPatientType] = useState(null);
//   const [mealPlans, setMealPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [typeRes, plansRes] = await Promise.all([
//           getPatientType(patientTypeId),
//           getMealPlans(patientTypeId),
//         ]);
//         setPatientType(typeRes.data);
//         setMealPlans(plansRes.data);
//       } catch (err) {
//         setError('Failed to load nutrition information');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [patientTypeId]);

//   if (loading) return <div className="text-center py-10">Loading...</div>;

//   if (error || !patientType) {
//     return (
//       <div className="max-w-7xl mx-auto py-8 px-4">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error || 'Patient type not found'}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <nav className="flex mb-8 text-sm">
//         <Link to="/nutrition" className="text-indigo-600 hover:text-indigo-500">
//           Nutrition
//         </Link>
//         <span className="mx-2 text-gray-500">/</span>
//         <span className="text-gray-700">{patientType.name}</span>
//       </nav>

//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">{patientType.name}</h1>
//         <p className="text-gray-600 mb-6">{patientType.description}</p>

//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Advice</h2>
//         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
//           <div className="flex">
//             <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
//             <p className="text-gray-700">{patientType.general_advice}</p>
//           </div>
//         </div>

//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Meal Plans</h2>
//         {mealPlans.length === 0 ? (
//           <p className="text-gray-500">No specific meal plans available for this condition.</p>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2">
//             {mealPlans.map((plan) => (
//               <div key={plan.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h3>
//                 <p className="text-gray-600 mb-4">{plan.description}</p>
//                 <div className="space-y-3">
//                   {Object.entries(plan.meals || {}).map(([mealTime, items]) => (
//                     <div key={mealTime}>
//                       <h4 className="font-medium text-gray-700 capitalize">{mealTime}</h4>
//                       <ul className="list-disc list-inside text-gray-600 ml-2">
//                         {Array.isArray(items) && items.map((item, idx) => (
//                           <li key={idx}>{item}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//                 <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
//                   Set as my plan
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PatientTypeDetail;




import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data (should match the IDs from Nutrition page)
const mockPatientTypes = {
  1: {
    id: 1,
    name: 'Diabetes',
    description: 'Manage blood sugar levels with proper diet.',
    general_advice: 'Avoid sugary foods, eat whole grains, and monitor carbs.',
    mealPlans: [
      {
        id: 101,
        title: 'Diabetes-Friendly Meal Plan',
        description: 'Balanced meals to maintain stable blood sugar.',
        meals: {
          breakfast: ['Oatmeal with berries', 'Scrambled eggs', 'Herbal tea'],
          lunch: ['Grilled chicken salad', 'Quinoa', 'Steamed vegetables'],
          dinner: ['Baked salmon', 'Brown rice', 'Roasted asparagus'],
          snacks: ['Apple slices with peanut butter', 'Greek yogurt']
        }
      }
    ]
  },
  2: {
    id: 2,
    name: 'Pregnancy',
    description: 'Nutrition for a healthy pregnancy.',
    general_advice: 'Increase folic acid, iron, and calcium. Stay hydrated.',
    mealPlans: [
      {
        id: 102,
        title: 'Prenatal Nutrition Plan',
        description: 'Nutrient-rich meals for mom and baby.',
        meals: {
          breakfast: ['Fortified cereal with milk', 'Orange juice', 'Whole wheat toast'],
          lunch: ['Spinach salad with grilled chicken', 'Lentil soup', 'Fruit'],
          dinner: ['Salmon with quinoa', 'Steamed broccoli', 'Sweet potato'],
          snacks: ['Almonds', 'Yogurt with berries']
        }
      }
    ]
  },
  // Add other patient types as needed
};

const PatientTypeDetail = () => {
  const { patientTypeId } = useParams();
  const [patientType, setPatientType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const type = mockPatientTypes[patientTypeId];
      if (type) {
        setPatientType(type);
      } else {
        setError('Patient type not found');
      }
      setLoading(false);
    }, 500);
  }, [patientTypeId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!patientType) return <div className="text-center py-10">Patient type not found</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/nutrition" className="text-indigo-600 hover:text-indigo-500">
          ← Back to Nutrition
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{patientType.name}</h1>
        <p className="text-gray-700 mb-4">{patientType.description}</p>
        <div className="bg-indigo-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-indigo-800 mb-2">General Advice</h2>
          <p className="text-indigo-700">{patientType.general_advice}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Meal Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patientType.mealPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>

            <div className="space-y-4">
              {plan.meals && Object.entries(plan.meals).map(([mealTime, items]) => (
                <div key={mealTime}>
                  <h4 className="font-medium text-gray-700 capitalize">{mealTime}</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Optional: Button to set as my plan (would need API) */}
            <button
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Set as My Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientTypeDetail;