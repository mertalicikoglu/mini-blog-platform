// src/auth/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

// useAuth Hook'u ile kimlik doğrulama işlevlerine erişim sağlıyoruz
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};