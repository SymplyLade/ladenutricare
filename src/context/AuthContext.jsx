// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);

//     const login = (userData) => setUser(userData);
//     const logout = () => setUser(null);
//     const signup = (userData) => setUser(userData);

//     const updateProfile = (updatedData) => {
//         setUser(updatedData);
//         // Update localStorage so data persists
//         localStorage.setItem('medicare_user', JSON.stringify(updatedData));
//     };

//     const resetPassword = (email, newPassword) => {
//         console.log(`Password reset for ${email}`);
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, signup, updateProfile, resetPassword }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);



import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('medicare_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData) => {
    // Example: userData should include role: 'user' | 'admin'
    setUser(userData);
    localStorage.setItem('medicare_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
  };

  const signup = (userData) => {
    setUser(userData);
    localStorage.setItem('medicare_user', JSON.stringify(userData));
  };

  const updateProfile = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('medicare_user', JSON.stringify(updatedData));
  };

  const resetPassword = (email, newPassword) => {
    console.log(`Password reset for ${email}`);
    // Implement real password reset logic here
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);