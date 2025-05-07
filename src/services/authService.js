import { mockUsers } from '../mock/data';

// Mock API delay
const mockAPIDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Replace cookie-based authentication with localStorage
const setAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const login = async (username, password) => {
  try {
    await mockAPIDelay(); // Simulate API delay
    
    const user = mockUsers.find(u => 
      u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = `mock-token-${Date.now()}`;
    setAuth(token, user); // Use localStorage instead of cookies
    
    return {
      token,
      user: {
        ...user,
        password: undefined // Don't store password in response
      }
    };
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const logout = () => {
  clearAuth(); // Clear localStorage
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const useAuth = () => {
  const login = async (username, password) => {
    try {
      await mockAPIDelay();
      
      const user = mockUsers.find(u => 
        u.username === username && u.password === password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('token', token);
      
      return {
        token,
        user: {
          ...user,
          password: undefined // Don't store password in response
        }
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return {
    login,
    logout,
    isAuthenticated,
  };
};
