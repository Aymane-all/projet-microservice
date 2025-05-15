import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';

// Components
import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/AdminDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Pages
import UsersPage from './components/admin/UsersPage';
import AppointmentsPage from './components/admin/AppointmentsPage';
import NotificationsPage from './components/admin/NotificationsPage';
import SettingsPage from './components/admin/SettingsPage';

// Doctor Pages
import MyAppointmentsPage from './components/doctor/MyAppointmentsPage';
import MyAvailabilityPage from './components/doctor/MyAvailabilityPage';

// Root component that wraps the entire app with auth context
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

// Component for all routes that need auth state
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={
          isAuthenticated 
            ? <Navigate to={user?.role === 'admin' ? '/admin' : '/doctor'} replace /> 
            : <LoginForm />
        } />
        
        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
        
        {/* Doctor routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="availability" element={<MyAvailabilityPage />} />
          </Route>
        </Route>
        
        {/* Default route - redirect to login or appropriate dashboard */}
        <Route 
          path="*" 
          element={
            isAuthenticated 
              ? <Navigate to={user?.role === 'admin' ? '/admin' : '/doctor'} replace /> 
              : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
