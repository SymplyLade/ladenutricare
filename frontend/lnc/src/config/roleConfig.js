export const ROLES = {
  USER: 'user',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

const ROLE_HOME = {
  [ROLES.USER]: '/dashboard',
  [ROLES.DOCTOR]: '/doctor-dashboard',
  [ROLES.ADMIN]: '/admin',
};

export const normalizeRole = (role) => {
  const normalized = String(role || '').toLowerCase();
  return ROLE_HOME[normalized] ? normalized : ROLES.USER;
};

export const getRoleHomePath = (role) => ROLE_HOME[normalizeRole(role)];

export const getPrimaryNavigation = (role) => {
  const currentRole = normalizeRole(role);
  const byRole = {
    [ROLES.USER]: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Appointments', href: '/appointments' },
      { name: 'Symptom Checker', href: '/symptom-checker' },
      { name: 'Nutrition', href: '/nutrition' },
    ],
    [ROLES.DOCTOR]: [
      { name: 'Home', href: '/' },
      { name: 'Doctor Dashboard', href: '/doctor-dashboard' },
    ],
    [ROLES.ADMIN]: [
      { name: 'Home', href: '/' },
      { name: 'Admin Panel', href: '/admin' },
    ],
  };
  return byRole[currentRole];
};

export const getUserMenuLinks = (role) => {
  const currentRole = normalizeRole(role);
  const links = [{ name: 'Your Profile', href: '/profile' }];
  if (currentRole === ROLES.USER) {
    links.push({ name: 'My Nutrition Plan', href: '/my-nutrition-plan' });
  }
  return links;
};
