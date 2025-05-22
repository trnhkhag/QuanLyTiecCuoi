import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Slider, 
  Button,
  Empty,
  Space,
} from 'antd';
import {
  SearchOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/layout/User/UserLayout';
import { LoadingSpinner, ErrorMessage } from '../../components/common/StatusComponents';
import HallService from '../../services/HallService';
import { FormattedPrice } from '../../components/common/FormattedPrice';

const { Option } = Select;

/**
 * Trang danh sách sảnh tiệc
 */
function HallListPage() {
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hallTypes, setHallTypes] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    capacity: [0, 1000],
    priceRange: [0, 100000000],
  });

  useEffect(() => {
    // Fetch danh sách sảnh và loại sảnh
    const fetchHalls = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Sử dụng HallService thay vì axios trực tiếp
        const response = await HallService.getHalls();
        
        if (response.success) {
          const hallData = response.data || [];
          setHalls(hallData);

          // Extract unique hall types from the halls data
          if (hallData.length > 0) {
            const uniqueTypes = [];
            hallData.forEach(hall => {
              if (hall.ID_LoaiSanh && !uniqueTypes.some(t => t.ID_LoaiSanh === hall.ID_LoaiSanh)) {
                uniqueTypes.push({
                  ID_LoaiSanh: hall.ID_LoaiSanh,
                  TenLoai: hall.TenLoai || hall.TenLoaiSanh || `Loại ${hall.ID_LoaiSanh}`
                });
              }
            });
            setHallTypes(uniqueTypes);
          }
        } else {
          setError('Không thể tải danh sách sảnh');
        }
      } catch (err) {
        console.error('Error fetching halls:', err);
        setError(err.message || 'Không thể tải danh sách sảnh tiệc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHalls();
  }, []);

  useEffect(() => {
    // Lọc sảnh khi có thay đổi về bộ lọc hoặc danh sách sảnh
    let result = [...halls];

    // Lọc theo tên
    if (filters.search) {
      result = result.filter(hall => 
        hall.TenSanh.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Lọc theo loại sảnh
    if (filters.type !== 'all') {
      result = result.filter(hall => hall.ID_LoaiSanh === filters.type);
    }

    // Lọc theo sức chứa
    result = result.filter(hall => 
      hall.SucChua >= filters.capacity[0] && 
      hall.SucChua <= filters.capacity[1]
    );

    // Lọc theo giá
    result = result.filter(hall => 
      hall.GiaThue >= filters.priceRange[0] && 
      hall.GiaThue <= filters.priceRange[1]
    );

    setFilteredHalls(result);
  }, [filters, halls]);

  if (loading) return (
    <UserLayout>
      <LoadingSpinner text="Đang tải danh sách sảnh..." />
    </UserLayout>
  );
  
  if (error) return (
    <UserLayout>
      <ErrorMessage message={error} />
    </UserLayout>
  );

  return (
    <UserLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '32px', marginBottom: 24 }}>Danh sách sảnh tiệc</h1>
        
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={6}>
              <Input
                placeholder="Tìm kiếm sảnh"
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: '100%' }}
                value={filters.type}
                onChange={value => setFilters({ ...filters, type: value })}
              >
                <Option value="all">Tất cả loại sảnh</Option>
                {hallTypes.map(type => (
                  <Option key={type.ID_LoaiSanh} value={type.ID_LoaiSanh}>
                    {type.TenLoai}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span>Sức chứa (khách):</span>
                <Slider
                  range
                  value={filters.capacity}
                  min={0}
                  max={1000}
                  onChange={value => setFilters({ ...filters, capacity: value })}
                />
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <span>Giá thuê (VNĐ):</span>
                <Slider
                  range
                  value={filters.priceRange}
                  min={0}
                  max={100000000}
                  step={1000000}
                  onChange={value => setFilters({ ...filters, priceRange: value })}
                />
              </Space>
            </Col>
          </Row>
        </Card>
      </div>

      {filteredHalls.length === 0 ? (
        <Empty
          description="Không tìm thấy sảnh tiệc nào phù hợp"
          style={{ margin: '48px 0' }}
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredHalls.map(hall => (
            <Col xs={24} sm={12} md={8} key={hall.ID_SanhTiec}>
              <Card
                hoverable
                cover={
                  <img
                    alt={hall.TenSanh}
                    src={`/assets/hall-${hall.ID_SanhTiec}.jpg`}
                    style={{ height: 200, objectFit: 'cover' }}
                    onError={e => { e.target.src = '/assets/hall-1.jpg' }}
                  />
                }
                actions={[
                  <Link to={`/booking/halls/${hall.ID_SanhTiec}`}>
                    <Button type="text">Chi tiết</Button>
                  </Link>,
                  <Link to={`/booking/new?hallId=${hall.ID_SanhTiec}`}>
                    <Button type="primary">Đặt tiệc</Button>
                  </Link>,
                ]}
              >
                <Card.Meta
                  title={hall.TenSanh}
                  description={
                    <>
                      <p><TeamOutlined /> Sức chứa: {hall.SucChua} khách</p>
                      <p><DollarOutlined /> Giá thuê: <FormattedPrice amount={hall.GiaThue} /></p>
                      <p>Loại sảnh: {hallTypes.find(t => t.ID_LoaiSanh === hall.ID_LoaiSanh)?.TenLoai}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </UserLayout>
  );
}

export default HallListPage;