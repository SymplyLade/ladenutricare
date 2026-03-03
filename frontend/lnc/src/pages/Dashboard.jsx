// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const cards = [
//   {
//     title: 'Appointments',
//     description: 'View and manage your appointments',
//     icon: 'https://img.icons8.com/color/96/calendar--v1.png',
//     link: '/appointments',
//     color: 'bg-blue-50',
//   },
//   {
//     title: 'Symptom Checker',
//     description: 'Check your symptoms with AI',
//     icon: 'https://img.icons8.com/color/96/stethoscope.png',
//     link: '/symptom-checker',
//     color: 'bg-green-50',
//   },
//   {
//     title: 'Medications',
//     description: 'Track your medications',
//     icon: 'https://img.icons8.com/color/96/pill.png',
//     link: '/medications',
//     color: 'bg-purple-50',
//   },
//   {
//     title: 'Nutrition Plans',
//     description: 'Personalized diet plans',
//     icon: 'https://img.icons8.com/color/96/healthy-eating.png',
//     link: '/nutrition',
//     color: 'bg-yellow-50',
//   },
//   {
//     title: 'Emergency Contacts',
//     description: 'Manage emergency contacts',
//     icon: 'https://img.icons8.com/color/96/emergency-call.png',
//     link: '/emergency-contacts',
//     color: 'bg-red-50',
//   },
//   {
//     title: 'Profile',
//     description: 'Update your personal info',
//     icon: 'https://img.icons8.com/color/96/user-male-circle.png',
//     link: '/profile',
//     color: 'bg-indigo-50',
//   },
// ];

// const Dashboard = () => {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
//         <p className="text-gray-600 mb-8">Manage your health journey from your dashboard.</p>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {cards.map((card) => (
//             <Link
//               key={card.title}
//               to={card.link}
//               className={`${card.color} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center`}
//             >
//               <img src={card.icon} alt={card.title} className="w-20 h-20 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
//               <p className="text-gray-600">{card.description}</p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  {
    title: 'Appointments',
    description: 'View and manage your appointments',
    icon: 'https://img.icons8.com/color/96/calendar--v1.png',
    link: '/appointments',
    color: 'bg-blue-50',
  },
  {
    title: 'Symptom Checker',
    description: 'Check your symptoms with AI',
    icon: 'https://img.icons8.com/color/96/stethoscope.png',
    link: '/symptom-checker',
    color: 'bg-green-50',
  },
  {
    title: 'Medications',
    description: 'Track your medications',
    icon: 'https://img.icons8.com/color/96/pill.png',
    link: '/medications',
    color: 'bg-purple-50',
  },
  {
    title: 'Nutrition Plans',
    description: 'Personalized diet plans',
    icon: 'https://img.icons8.com/color/96/healthy-eating.png',
    link: '/nutrition',
    color: 'bg-yellow-50',
  },
  {
    title: 'Emergency Contacts',
    description: 'Manage emergency contacts',
    icon: 'https://img.icons8.com/color/96/emergency-call.png',
    link: '/emergency-contacts',
    color: 'bg-red-50',
  },
  {
    title: 'Profile',
    description: 'Update your personal info',
    icon: 'https://img.icons8.com/color/96/user-male-circle.png',
    link: '/profile',
    color: 'bg-indigo-50',
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">Manage your health journey from your dashboard.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`${card.color} rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center`}
            >
              <img src={card.icon} alt={card.title} className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;