import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon, link, color = 'bg-indigo-600' }) => {
  return (
    <Link to={link} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center">
        <div className={`mb-4 p-3 rounded-lg ${color}`}>
          <img src={icon} alt={title} className="h-12 w-12" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default FeatureCard;