import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import DashboardPage from '../../pages/DashboardPage';
import HallManagementPage from '../../pages/Hall/HallManagementPage';
import RegulationManagementPage from '../../pages/Regulation/RegulationManagementPage';

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