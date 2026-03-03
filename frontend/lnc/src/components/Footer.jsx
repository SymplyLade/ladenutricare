import { Link } from 'react-router-dom';
import lncLogo from '../assets/lnc-logo.svg';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={lncLogo} alt="LNC logo" className="h-10 w-10 rounded-md" />
              <h3 className="text-lg font-semibold">LNC</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your complete telemedicine solution - appointments, symptom checker, nutrition plans, and more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
              <li><Link to="/appointments" className="text-gray-300 hover:text-white">Appointments</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">Email: info@ladenutricare.com</p>
            <p className="text-gray-300 text-sm">Phone: +123 456 7890</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-300">
          Copyright {new Date().getFullYear()} LNC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
