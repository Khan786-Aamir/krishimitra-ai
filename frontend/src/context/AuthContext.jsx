import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifies token on initial load
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Set the token headers dynamically if not already intercepted
      const response = await authService.getCurrentUser();
      if (response && response.data?.success && response.data?.data?.user) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response && response.data?.success && response.data?.data) {
        const token = response.data.data.token;
        const userData = response.data.data.user;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        throw new Error('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async ({ name, email, phone, password, role }) => {
    setLoading(true);
    try {
      const response = await authService.register({ name, email, phone, password, role });
      if (response && response.data?.success && response.data?.data) {
        const token = response.data.data.token;
        const userData = response.data.data.user;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        throw new Error('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
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
