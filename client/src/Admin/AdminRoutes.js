import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import HallManagementPage from './pages/HallManagementPage';
import RegulationManagementPage from './pages/RegulationManagementPage';

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/halls" element={<HallManagementPage />} />
        <Route path="/regulations" element={<RegulationManagementPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default AdminRoutes;