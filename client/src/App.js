import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import Booking Module
import BookingRoutes from './Booking';

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...');
  const [halls, setHalls] = useState([]);
  const [foods, setFoods] = useState([]);
  const [services, setServices] = useState([]);

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

  // Fetch wedding halls data
  const fetchHalls = () => {
    axios.get('http://localhost:5000/api/halls')
      .then(response => {
        setHalls(response.data);
      })
      .catch(error => {
        console.error('Error fetching halls:', error);
      });
  };

  // Fetch foods data
  const fetchFoods = () => {
    axios.get('http://localhost:5000/api/foods')
      .then(response => {
        setFoods(response.data);
      })
      .catch(error => {
        console.error('Error fetching foods:', error);
      });
  };

  // Fetch services data
  const fetchServices = () => {
    axios.get('http://localhost:5000/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  };

  // Load initial data
  useEffect(() => {
    fetchHalls();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Booking Routes - Completely separate UI */}
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
                <Link to="/halls" className="nav-link" onClick={fetchHalls}>Sảnh cưới</Link>
                <Link to="/foods" className="nav-link" onClick={fetchFoods}>Món ăn</Link>
                <Link to="/services" className="nav-link" onClick={fetchServices}>Dịch vụ</Link>
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