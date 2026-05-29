// src/routes/ProtectedRoutes.tsx
// Carpeta nueva: src/routes/
//
// PrivateRoute → cualquier usuario autenticado
//   Si no hay sesión: redirige a /Login
//
// AdminRoute → solo rol 'admin'
//   Si no hay sesión: redirige a /Login
//   Si hay sesión pero no es admin: redirige a /MenuPrincipal

import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── PrivateRoute ─────────────────────────────────────────────
interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuth, isLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) return null; // espera restaurar sesión desde localStorage

        return isAuth() ? (
          <Component {...props} />
        ) : (
          // guarda la ruta a la que intentaba acceder
          <Redirect to={{ pathname: '/Login', state: { from: props.location } }} />
        );
      }}
    />
  );
};

// ── AdminRoute ───────────────────────────────────────────────
interface AdminRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuth, isAdmin, isLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) return null;

        if (!isAuth())
          return <Redirect to={{ pathname: '/Login', state: { from: props.location } }} />;

        if (!isAdmin())
          return <Redirect to="/MenuPrincipal" />;

        return <Component {...props} />;
      }}
    />
  );
};