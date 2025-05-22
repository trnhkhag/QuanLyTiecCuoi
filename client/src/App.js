//Main App component
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

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

// Admin Routes
import AdminRoutes from './main/Admin/AdminRoutes';

// Booking Routes
import BookingRoutes from './main/Booking/BookingRoutes';

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...');

  useEffect(() => {
    // Test API connection
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    axios.get(`${API_URL}/test`)
      .then(response => {
        setApiStatus(response.data.message);
      })
      .catch(error => {
        console.error('API connection error:', error);
        setApiStatus('API connection failed. Please make sure the server is running.');
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoice/:id" element={<InvoiceInformationPage />} />
          <Route path="/reports" element={<MonthlyReportPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/booking/*" element={<BookingRoutes />} />
        </Route>

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
