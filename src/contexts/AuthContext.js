import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://esimbackend-78d0b12a97f7.herokuapp.com';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Verify token on initial load
        checkAuth(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/user/verify`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': userData.pareto
        },
        mode: 'cors'
      });

      if (response.ok) {
        setUser(userData);
      } else {
        // Clear invalid session
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        await fetch(`${API_URL}/api/user/logout`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': userData.pareto
          },
          mode: 'cors'
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 