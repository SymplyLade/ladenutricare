// import { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       api.get('/auth/me')
//         .then(response => {
//           setUser(response.data);
//         })
//         .catch(() => {
//           localStorage.removeItem('access_token');
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     const response = await api.post('/auth/login', { email, password });
//     const { access_token, user } = response.data;
//     localStorage.setItem('access_token', access_token);
//     setUser(user);
//     return user;
//   };

//   const register = async (userData) => {
//     const response = await api.post('/auth/register', userData);
//     return response.data;
//   };

//   const logout = () => {
//     localStorage.removeItem('access_token');
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };



import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    
    // Fetch user profile
    const userResponse = await api.get('/auth/me');
    setUser(userResponse.data);
    return userResponse.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    // After registration, you might want to auto-login or just return
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};