//Routes for the app
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import InvoicesPage from './pages/invoice/InvoicesPage';
import InvoiceInformationPage from './pages/invoice/InvoiceInformationPage';
import MonthlyReportPage from './pages/report/MonthlyReportPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoice/:id" element={<InvoiceInformationPage />} />
        <Route path="/reports/monthly" element={<MonthlyReportPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
