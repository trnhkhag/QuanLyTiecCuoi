import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { PERMISSIONS } from '../../services/authService';
import AdminLayout from '../../components/layout/Admin/AdminLayout';
import DashboardPage from '../../pages/DashboardPage';
import HallManagementPage from '../../pages/Hall/HallManagementPage';
import RegulationManagementPage from '../../pages/Regulation/RegulationManagementPage';

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/halls" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_HALLS}>
            <HallManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/regulations" element={
          <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_REGULATIONS}>
            <RegulationManagementPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AdminLayout>
  );
}

export default AdminRoutes;