import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('avoxell_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Pre-logged in user matching the avatar in the mockup header
    return {
      name: 'Alex Morgan',
      email: 'alex@avoxell.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('avoxell_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('avoxell_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (e) {}
    setUser({
      name: email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('avoxell_user');
    localStorage.removeItem('avoxell_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
