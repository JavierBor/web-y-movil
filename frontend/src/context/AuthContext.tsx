// src/context/AuthContext.tsx
// Carpeta nueva: src/context/
//
// Qué hace: guarda el token y usuario en memoria React
// y los restaura desde localStorage al recargar la página.
// Usa las mismas claves que ya usa Login.tsx:
//   localStorage.getItem('token')
//   localStorage.getItem('usuario_conectado')

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id:     number;
  nombre: string;
  correo: string;
  rol:    UserRole;
}

interface AuthContextType {
  user:      AuthUser | null;
  token:     string | null;
  isLoading: boolean;
  login:     (token: string, user: AuthUser) => void;
  logout:    () => void;
  isAdmin:   () => boolean;
  isAuth:    () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Mismas claves que ya usa el proyecto ────────────────────
const TOKEN_KEY = 'token';
const USER_KEY  = 'usuario_conectado';

// ── Verifica si el JWT está expirado sin librerías externas ─
const isExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    if (!payload.exp) return false;           // sin exp → no expira
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;                              // token malformado → expirado
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sesión al recargar la página
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      if (isExpired(storedToken)) {
        // Token vencido → limpia todo
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        setToken(storedToken);
        try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
      }
    }
    setIsLoading(false);
  }, []);

  // Lo llama Login.tsx después de recibir la respuesta del backend
  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Lo llama CustomHeader al hacer click en "Cerrar sesión"
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user?.rol === 'admin';
  const isAuth  = () => !!token && !isExpired(token);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar en cualquier componente
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};