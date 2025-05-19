// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [apiStatus, setApiStatus] = useState('Loading...');
//   const [halls, setHalls] = useState([]);
//   const [foods, setFoods] = useState([]);
//   const [services, setServices] = useState([]);
//   const [activeTab, setActiveTab] = useState('test');

//   useEffect(() => {
//     // Test API connection
//     axios.get('http://localhost:5000/api/test')
//       .then(response => {
//         setApiStatus(response.data.message);
//       })
//       .catch(error => {
//         console.error('API connection error:', error);
//         setApiStatus('API connection failed. Please make sure the server is running.');
//       });
//   }, []);

//   // Fetch wedding halls data
//   const fetchHalls = () => {
//     setActiveTab('halls');
//     axios.get('http://localhost:5000/api/wedding-halls')
//       .then(response => {
//         setHalls(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching halls:', error);
//       });
//   };

//   // Fetch foods data
//   const fetchFoods = () => {
//     setActiveTab('foods');
//     axios.get('http://localhost:5000/api/foods')
//       .then(response => {
//         setFoods(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching foods:', error);
//       });
//   };

//   // Fetch services data
//   const fetchServices = () => {
//     setActiveTab('services');
//     axios.get('http://localhost:5000/api/services')
//       .then(response => {
//         setServices(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching services:', error);
//       });
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Hệ Thống Quản Lý Tiệc Cưới</h1>
//         <p>Trạng thái API: {apiStatus}</p>
        
//         <div className="navigation">
//           <button onClick={() => setActiveTab('test')}>Trang chủ</button>
//           <button onClick={fetchHalls}>Danh sách Sảnh cưới</button>
//           <button onClick={fetchFoods}>Danh sách Món ăn</button>
//           <button onClick={fetchServices}>Danh sách Dịch vụ</button>
//         </div>

//         {activeTab === 'test' && (
//           <div className="welcome-section">
//             <h2>Chào mừng đến với Hệ thống Quản lý Tiệc Cưới</h2>
//             <p>Nhấp vào các nút trên để xem dữ liệu</p>
//           </div>
//         )}

//         {activeTab === 'halls' && (
//           <div className="data-section">
//             <h2>Danh sách Sảnh cưới</h2>
//             {halls.length === 0 ? (
//               <p>Đang tải dữ liệu hoặc không có dữ liệu</p>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Mã Sảnh</th>
//                     <th>Tên Sảnh</th>
//                     <th>Sức chứa</th>
//                     <th>Giá tối thiểu</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {halls.map(hall => (
//                     <tr key={hall.MA_SANH || hall.id}>
//                       <td>{hall.MA_SANH}</td>
//                       <td>{hall.TEN_SANH}</td>
//                       <td>{hall.SUC_CHUA}</td>
//                       <td>{hall.GIA_TOI_THIEU?.toLocaleString()} VNĐ</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {activeTab === 'foods' && (
//           <div className="data-section">
//             <h2>Danh sách Món ăn</h2>
//             {foods.length === 0 ? (
//               <p>Đang tải dữ liệu hoặc không có dữ liệu</p>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Mã Món</th>
//                     <th>Tên Món</th>
//                     <th>Đơn giá</th>
//                     <th>Ghi chú</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {foods.map(food => (
//                     <tr key={food.MA_MON || food.id}>
//                       <td>{food.MA_MON}</td>
//                       <td>{food.TEN_MON}</td>
//                       <td>{food.DON_GIA?.toLocaleString()} VNĐ</td>
//                       <td>{food.GHI_CHU}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {activeTab === 'services' && (
//           <div className="data-section">
//             <h2>Danh sách Dịch vụ</h2>
//             {services.length === 0 ? (
//               <p>Đang tải dữ liệu hoặc không có dữ liệu</p>
//             ) : (
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Mã Dịch vụ</th>
//                     <th>Tên Dịch vụ</th>
//                     <th>Đơn giá</th>
//                     <th>Ghi chú</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {services.map(service => (
//                     <tr key={service.MA_DV || service.id}>
//                       <td>{service.MA_DV}</td>
//                       <td>{service.TEN_DV}</td>
//                       <td>{service.DON_GIA?.toLocaleString()} VNĐ</td>
//                       <td>{service.GHI_CHU}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeddingSearchPage from './Browsing/pages/WeddingSearchPage';
import WeddingDetailPage from './Browsing/pages/WeddingDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/wedding-search" element={<WeddingSearchPage />} />
        <Route path="/weddings/:id" element={<WeddingDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;