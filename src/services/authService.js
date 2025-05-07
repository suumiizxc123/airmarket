import { mockUsers } from '../mock/data';

// Mock API delay
const mockAPIDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Cookie management
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + "; " + expires + "; path=/";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
    setCookie('token', token, 1); // Session cookie that expires in 1 day
    setCookie('user', JSON.stringify(user), 1);
    
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
  deleteCookie('token');
  deleteCookie('user');
};

export const isAuthenticated = () => {
  return getCookie('token') !== null;
};

export const getToken = () => {
  return getCookie('token');
};

export const getUser = () => {
  const userStr = getCookie('user');
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
