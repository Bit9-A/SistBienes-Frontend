import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import React, { useState, Suspense } from 'react';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <AuthProvider>
        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          <Route
            path="admin/*"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Cargando...</div>}> {/* Add a loading fallback */}
                  <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}
