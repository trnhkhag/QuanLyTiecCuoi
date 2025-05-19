import React, { useState, useEffect } from 'react';
import { searchWeddings } from '../services/weddingApi';
import { useNavigate } from 'react-router-dom';
import '../../css/WeddingLookup.css';

const WeddingLookup = () => {
  const [filters, setFilters] = useState({
    customerName: '',
    date: '',
    hallName: ''
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const data = await searchWeddings(filters);
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Lỗi khi gọi API');
      setResults([]);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/weddings/${id}`);
  };

  // Gọi API khi component vừa mount để lấy toàn bộ tiệc cưới
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await searchWeddings({});
        setResults(data);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu ban đầu');
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="wedding-lookup">
      <h2>Tra cứu tiệc cưới</h2>
      <div>
        <input
          type="text"
          name="customerName"
          placeholder="Tên khách hàng"
          value={filters.customerName}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="hallName"
          placeholder="Tên sảnh"
          value={filters.hallName}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%', cursor: 'pointer' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày tổ chức</th>
            <th>Ca</th>
            <th>Tên sảnh</th>
            <th>Số bàn</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="6">Không có kết quả</td>
            </tr>
          ) : (
            results.map((item) => (
              <tr
                key={item.ID_TiecCuoi}
                onClick={() => handleRowClick(item.ID_TiecCuoi)}
                style={{ transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
              >
                <td>{item.ID_TiecCuoi}</td>
                <td>{item.TenKhachHang}</td>
                <td>{new Date(item.NgayToChuc).toLocaleDateString('vi-VN')}</td>
                <td>{item.TenCa}</td>
                <td>{item.TenSanh}</td>
                <td>{item.SoLuongBan}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeddingLookup;