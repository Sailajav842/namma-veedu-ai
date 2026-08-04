import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signupWithRole: (data: { email: string; name: string; role: UserRole; licenseNumber?: string; organization?: string }) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  switchDemoUser: (userRole: UserRole) => void;
  logout: () => void;
  updateRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('buildai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0]; // Default to Customer (Sarah)
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const role: UserRole = user?.role || 'customer';

  useEffect(() => {
    if (user) {
      localStorage.setItem('buildai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('buildai_user');
    }
  }, [user]);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600)); // Smooth simulated async check
    
    // Check if matches existing demo user email
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (found) {
      setUser({ ...found, lastLoginAt: new Date().toISOString() });
      setIsLoading(false);
      return { success: true };
    } else {
      // Create session for new user
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0].replace('.', ' '),
        role: 'customer',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setUser(newUser);
      setIsLoading(false);
      return { success: true, message: 'Logged in successfully.' };
    }
  };

  const signupWithRole = async (data: { email: string; name: string; role: UserRole; licenseNumber?: string; organization?: string }) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      licenseNumber: data.licenseNumber,
      organization: data.organization,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(newUser);
    setIsLoading(false);
    return { success: true, message: 'Account created successfully!' };
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 700));

    const googleUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      email: 'user.google@gmail.com',
      name: 'Google Auth User',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    setUser(googleUser);
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    await new Promise((res) => setTimeout(res, 600));
    return {
      success: true,
      message: `Password reset link has been dispatched to ${email}. Please check your inbox.`,
    };
  };

  const switchDemoUser = (userRole: UserRole) => {
    const target = DEMO_USERS.find((u) => u.role === userRole) || DEMO_USERS[0];
    setUser({ ...target, lastLoginAt: new Date().toISOString() });
  };

  const logout = () => {
    setUser(null);
  };

  const updateRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        signupWithRole,
        loginWithGoogle,
        resetPassword,
        switchDemoUser,
        logout,
        updateRole,
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
