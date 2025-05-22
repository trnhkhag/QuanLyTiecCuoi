import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookingHeader from '../../components/layout/Booking/BookingHeader';
import BookingFooter from '../../components/layout/Booking/BookingFooter';
import BookingHomePage from '../../pages/HomePage';
import BookingFormPage from '../../pages/Booking/BookingFormPage';
import BookingListPage from '../../pages/Booking/BookingListPage';
import HallDetailPage from '../../pages/Hall/HallDetailPage';
import HallListPage from '../../pages/Hall/HallListPage';
import BookingSuccessPage from '../../pages/Booking/BookingSuccessPage';
import RegulationListPage from '../../pages/Regulation/RegulationListPage';
import RegulationManagementPage from '../../pages/Regulation/RegulationManagementPage';
import WeddingLookupPage from '../../pages/Wedding/WeddingLookupPage';
import WeddingDetailPage from '../../pages/Wedding/WeddingDetailPage';

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
          <Route path="list" element={<BookingListPage />} />          <Route path="halls" element={<HallListPage />} />
          <Route path="halls/:id" element={<HallDetailPage />} />
          <Route path="detail/:id" element={<HallDetailPage />} />
          <Route path="success" element={<BookingSuccessPage />} />
          <Route path="success/:id" element={<BookingSuccessPage />} />
          <Route path="regulations" element={<RegulationListPage />} />
          <Route path="regulations/manage" element={<RegulationManagementPage />} />
          <Route path="lookup" element={<WeddingLookupPage />} />
          <Route path="weddings/:id" element={<WeddingDetailPage />} />
        </Routes>
      </div>
      <BookingFooter />
    </div>
  );
}

export default BookingRoutes;
