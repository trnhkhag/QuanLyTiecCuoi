//Main App component
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { PERMISSIONS } from './services/authService';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import InvoicesPage from './pages/invoice/InvoicesPage';
import InvoiceInformationPage from './pages/invoice/InvoiceInformationPage';
import MonthlyReportPage from './pages/report/MonthlyReportPage';
import ProfilePage from './pages/Profile/ProfilePage';

// Admin Routes
import AdminRoutes from './main/Admin/AdminRoutes';

// Booking Routes
import BookingRoutes from './main/Booking/BookingRoutes';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Layout Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/invoices" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVOICES}>
              <InvoicesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/invoice/:id" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_INVOICES}>
              <InvoiceInformationPage />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_REPORTS}>
              <MonthlyReportPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PROFILE}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_HALLS | PERMISSIONS.MANAGE_REGULATIONS | PERMISSIONS.MANAGE_USERS}>
              <AdminRoutes />
            </ProtectedRoute>
          } />
            <Route path="/booking/*" element={
            <ProtectedRoute requiredPermission={PERMISSIONS.BOOK_WEDDING | PERMISSIONS.MANAGE_BOOKINGS | PERMISSIONS.SEARCH_WEDDINGS}>
              <BookingRoutes />
            </ProtectedRoute>
          } />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
