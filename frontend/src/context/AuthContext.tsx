import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => { return {}; },
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Configure axios defaults
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Decode the JWT to get user info
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const decodedToken = JSON.parse(jsonPayload);
          
          const userData = {
            id: decodedToken.nameid || decodedToken.sub,
            username: decodedToken.unique_name || decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          };
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      // El registro ya no retorna token, solo mensaje de éxito
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};