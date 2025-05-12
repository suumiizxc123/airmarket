const API_URL = 'https://esimbackend-78d0b12a97f7.herokuapp.com';

// Replace cookie-based authentication with localStorage
const setAuth = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

const clearAuth = () => {
  localStorage.removeItem('user');
};

export const login = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      body: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      mode: 'cors'
    });

    const data = await response.json();

    if (response.status === 200 && data.message === 'success') {
      const userData = {
        uid: data.uid,
        email: data.email,
        role: data.role,
        auth_token: data.auth_token,
        pareto: data.pareto
      };
      
      setAuth(userData);
      return userData;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const logout = async () => {
  try {
    const userData = getUser();
    if (userData?.pareto) {
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
    clearAuth();
  }
};

export const isAuthenticated = () => {
  const user = getUser();
  return user !== null && user.pareto !== null;
};

export const getToken = () => {
  const user = getUser();
  return user?.pareto || null;
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const useAuth = () => {
  const login = async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        body: params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: 'cors'
      });

      const data = await response.json();

      if (response.status === 200 && data.message === 'success') {
        const userData = {
          uid: data.uid,
          email: data.email,
          role: data.role,
          auth_token: data.auth_token,
          pareto: data.pareto
        };
        
        setAuth(userData);
        return userData;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      const userData = getUser();
      if (userData?.pareto) {
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
      clearAuth();
    }
  };

  const isAuthenticated = () => {
    const user = getUser();
    return user !== null && user.pareto !== null;
  };

  return {
    login,
    logout,
    isAuthenticated,
  };
};
