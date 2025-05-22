// Export Routes
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HallListPage from './pages/HallListPage';
import HallDetailPage from './pages/HallDetailPage';
import BookingFormPage from './pages/BookingFormPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import WeddingLookupPage from './pages/WeddingLookupPage';
import RegulationPage from './pages/RegulationPage';

// Import styles
import './styles/styles.css';

const BookingRoutes = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="halls" element={<HallListPage />} />
      <Route path="halls/:id" element={<HallDetailPage />} />
      <Route path="new" element={<BookingFormPage />} />
      <Route path="success" element={<BookingSuccessPage />} />
      <Route path="lookup" element={<WeddingLookupPage />} />
      <Route path="regulations" element={<RegulationPage />} />
    </Routes>
  );
};

// Default export for easy importing
export default BookingRoutes;
