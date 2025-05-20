import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import Routes
import BookingRoutes from './main/Booking/BookingRoutes';
import AdminRoutes from './main/Admin/AdminRoutes';

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...');

  useEffect(() => {
    // Test API connection
    axios.get('http://localhost:5000/api/test')
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
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Booking Routes */}
        <Route path="/booking/*" element={<BookingRoutes />} />
        
        {/* Main App Routes */}
        <Route path="/*" element={
          <div className="App">
            <header className="App-header">
              <h1>Hệ Thống Quản Lý Tiệc Cưới</h1>
              <p>Trạng thái API: {apiStatus}</p>
              
              <div className="navigation">
                <Link to="/" className="nav-link">Trang chủ</Link>
                <Link to="/booking" className="nav-link">Đặt tiệc</Link>
                <Link to="/admin" className="nav-link">Quản trị</Link>
              </div>
            </header>
            
            <footer className="App-footer">
              <p>© 2025 Hệ thống Quản lý Tiệc Cưới</p>
            </footer>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;