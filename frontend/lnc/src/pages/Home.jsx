import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    name: 'Appointment Booking',
    description: 'Schedule appointments with top doctors at your convenience.',
    icon: 'https://img.icons8.com/color/96/appointment-scheduling.png',
  },
  {
    name: 'Symptom Checker',
    description: 'AI-powered analysis of your symptoms and recommendations.',
    icon: 'https://img.icons8.com/color/96/stethoscope.png',
  },
  {
    name: 'Medication Tracker',
    description: 'Never miss a dose with reminders and expiry alerts.',
    icon: 'https://img.icons8.com/color/96/pill.png',
  },
  {
    name: 'Nutrition Plans',
    description: 'Personalized diet plans based on your health goals.',
    icon: 'https://img.icons8.com/color/96/healthy-eating.png',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Your Health, Our Priority
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  LadeNutriCare brings telemedicine to your fingertips. Consult doctors, check symptoms, track medications, and get personalized nutrition plans – all from the comfort of your home.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  {user ? (
                    <Link
                      to="/dashboard"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Get started
                      </Link>
                      <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                        Log in <span aria-hidden="true">→</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" aria-hidden="true" />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Doctor with tablet"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive telemedicine platform
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Access all your healthcare needs in one place, powered by modern technology.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <img src={feature.icon} alt="" className="h-7 w-7" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Home;