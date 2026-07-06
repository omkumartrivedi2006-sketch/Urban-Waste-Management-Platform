import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Citizen' | 'Driver' | 'Municipal Admin';
  phone?: string;
  points: number;
  profileImage: string;
  address?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string; role: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  updateUserLocal: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5001/api/auth'; // Using backend PORT 5001 from .env

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('uwmp_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  // Load user data on startup if token is available
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          localStorage.removeItem('uwmp_token');
          setToken(null);
          setUser(null);
          showToast('Session expired, please login again.', 'info');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token, showToast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('uwmp_token', data.token);
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          points: data.points,
          profileImage: data.profileImage,
          address: data.address || '',
          createdAt: data.createdAt
        });
        showToast(`Welcome back, ${data.name}!`, 'success');
        return true;
      } else {
        showToast(data.message || 'Login failed. Please check your credentials.', 'error');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Server is currently offline. Please try again later.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('uwmp_token', data.token);
        setToken(data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          points: data.points,
          profileImage: data.profileImage,
          address: data.address || '',
          createdAt: data.createdAt
        });
        showToast('Registration successful! Welcome to UWMP.', 'success');
        return true;
      } else {
        showToast(data.message || 'Registration failed.', 'error');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Server is currently offline. Please try again later.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('uwmp_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const updateUserLocal = (updatedFields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedFields });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUserLocal
      }}
    >
      {children}
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
