import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Stethoscope, Pill, Apple, Activity } from 'lucide-react';
import lncLogo from '../assets/lnc-logo.svg';
import { getRoleHomePath } from '../config/roleConfig';

const features = [
  {
    name: 'Appointment Booking',
    description: 'Schedule appointments with top doctors at your convenience.',
    icon: Stethoscope,
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Symptom Checker',
    description: 'AI-powered analysis of your symptoms and recommendations.',
    icon: Activity,
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    name: 'Medication Tracker',
    description: 'Never miss a dose with reminders and expiry alerts.',
    icon: Pill,
    gradient: 'from-rose-400 to-rose-600',
  },
  {
    name: 'Nutrition Plans',
    description: 'Personalized diet plans based on your health goals.',
    icon: Apple,
    gradient: 'from-orange-400 to-orange-600',
  },
];

const coreServices = [
  {
    title: 'Virtual Consultations',
    text: 'Talk to qualified doctors from anywhere in Africa.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Hospital Referrals',
    text: 'Get linked to trusted hospital facilities quickly.',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Nutrition Guidance',
    text: 'Receive meal plans based on your condition and goals.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
  },
];

const africaHospitalImages = [
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
];

const stats = [
  { label: 'Active Users', value: '50K+' },
  { label: 'Doctors Available', value: '500+' },
  { label: 'Consultations', value: '100K+' },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=70';

const Home = () => {
  const { user } = useAuth();
  const dashboardPath = getRoleHomePath(user?.role);
  const handleImageError = (event) => {
    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  return (
    <div className="bg-blue-100 overflow-hidden">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-gradient-to-b from-indigo-200 to-transparent rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-gradient-to-t from-indigo-100 to-transparent rounded-full blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid lg:grid-cols-2 lg:gap-x-12 items-center">
            <div className="lg:pr-8">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                  <img src={lncLogo} alt="LNC logo" className="w-5 h-5 rounded" />
                  LNC
                </span>
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="mt-8 text-lg text-gray-600 leading-relaxed max-w-lg">
                LadeNutriCare brings comprehensive healthcare to your fingertips. Consult with top doctors, check symptoms with AI assistance, track medications, and get personalized nutrition plans - all from home.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-indigo-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-indigo-400/50 transition-all duration-300 transform hover:scale-105"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-indigo-600">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 lg:mt-0 relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
                  alt="African hospital healthcare team"
                  loading="lazy"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-8 bg-white rounded-xl shadow-xl p-6 max-w-xs animate-pulse-slow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Health Monitoring</span>
                </div>
                <p className="text-xs text-gray-600">Real-time tracking of your vital signs</p>
              </div>

              <div className="absolute -top-6 -right-8 bg-white rounded-xl shadow-xl p-6 max-w-xs animate-pulse-slow" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Expert Doctors</span>
                </div>
                <p className="text-xs text-gray-600">Connect with verified healthcare professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-blue-400">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Core Services</h2>
            <p className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Healthcare Services You Can Rely On</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {coreServices.map((service) => (
              <div key={service.title} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <img src={service.image} alt={service.title} loading="lazy" onError={handleImageError} className="w-full h-44 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.name}
                  className="group relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  style={{
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                  <div className={`mb-6 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-12 transition-all duration-300`} />
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .animate-pulse-slow {
            animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>

      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Africa Hospital Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {africaHospitalImages.map((src) => (
              <div key={src} className="rounded-xl overflow-hidden shadow-md">
                <img src={src} alt="Africa hospital" loading="lazy" onError={handleImageError} className="w-full h-56 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-24 sm:py-32 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-40 -mt-40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-40 -mb-40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Join thousands of users who have already improved their health with LadeNutriCare.
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              >
                Sign In to Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
