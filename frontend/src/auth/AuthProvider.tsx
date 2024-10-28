// src/auth/AuthProvider.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as AuthService from './AuthService';

interface AuthContextType {
  user: any;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const signUp = async (email: string, password: string) => {
    const response = await AuthService.signUp(email, password);
    setUser(response.user);
  };

  const signIn = async (email: string, password: string) => {
    const response = await AuthService.signIn(email, password);
    setUser(response.user);
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
