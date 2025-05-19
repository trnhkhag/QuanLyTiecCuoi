import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookingHeader from './components/layout/BookingHeader';
import BookingFooter from './components/layout/BookingFooter';
import BookingHomePage from './pages/HomePage';
import BookingFormPage from './pages/BookingFormPage';
import BookingListPage from './pages/BookingListPage';
import HallDetailPage from './pages/HallDetailPage';
import HallListPage from './pages/HallListPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import RegulationListPage from './pages/RegulationListPage';
import RegulationManagementPage from './pages/RegulationManagementPage';

/**
 * Main component for the Booking feature that handles all routing
 */
function BookingRoutes() {
  return (
    <div className="booking-module">
      <BookingHeader />
      <div className="booking-content">
        <Routes>
          <Route path="" element={<BookingHomePage />} />
          <Route path="new" element={<BookingFormPage />} />
          <Route path="list" element={<BookingListPage />} />
          <Route path="halls" element={<HallListPage />} />
          <Route path="halls/:id" element={<HallDetailPage />} />
          <Route path="detail/:id" element={<HallDetailPage />} />
          <Route path="success/:id" element={<BookingSuccessPage />} />
          <Route path="regulations" element={<RegulationListPage />} />
          <Route path="regulations/manage" element={<RegulationManagementPage />} />
        </Routes>
      </div>
      <BookingFooter />
    </div>
  );
}

export default BookingRoutes;
