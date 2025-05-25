import './assets/css/App.css';
import { Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import { AuthProvider } from './contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { getRouteConfig } from './routes';
import ProtectedRoute from './components/ProtectedRoute';

export default function Main() {
  const [currentTheme] = useState(initialTheme);
  const routes = getRouteConfig();

  // Envolver las rutas de admin con ProtectedRoute
  routes.forEach(route => {
    if (route.path === '/admin') {
      const originalElement = route.element;
      route.element = <ProtectedRoute>{originalElement}</ProtectedRoute>;
    }
  });

  const routing = useRoutes(routes);

  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        {routing}
      </AuthProvider>
    </ChakraProvider>
  );
}
