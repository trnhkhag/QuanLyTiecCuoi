import React, { useEffect, useState } from 'react';
import { Select, Form } from 'antd';
const { Option } = Select;

/**
 * Component bọc ngoài Select để hiển thị tên sảnh thay vì ID sảnh
 */
const HallSelectWrapper = ({ 
  value, 
  onChange, 
  halls, 
  fetchHallDetails,
  placeholder = "Chọn sảnh tiệc",
  showSearch = true,
  style = {}
}) => {
  const [selectedHallId, setSelectedHallId] = useState(value);
  
  // Khi giá trị value thay đổi từ bên ngoài (form.setFieldsValue)
  useEffect(() => {
    if (value !== undefined && value !== selectedHallId) {
      setSelectedHallId(value);
      
      // Gọi fetchHallDetails khi có sảnh được chọn từ bên ngoài
      if (fetchHallDetails && value) {
        fetchHallDetails(value);
      }
    }
  }, [value, fetchHallDetails, selectedHallId]);
  
  // Tìm sảnh theo ID để kiểm tra giá trị hiện tại
  const selectedHall = halls?.find(hall => hall.ID_SanhTiec === parseInt(selectedHallId));
  
  const handleChange = (newValue) => {
    console.log('Hall changed:', newValue);
    setSelectedHallId(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Gọi fetchHallDetails khi người dùng chọn sảnh mới
    if (fetchHallDetails && newValue) {
      fetchHallDetails(newValue);
    }
  };
  
  return (
    <Select
      placeholder={placeholder}
      value={selectedHallId} 
      onChange={handleChange}
      showSearch={showSearch}
      optionFilterProp="children"
      style={{ width: '100%', ...style }}
    >
      {Array.isArray(halls) && halls.length > 0 ? 
        halls.map(hall => (
          <Option 
            key={`hall-${hall.ID_SanhTiec}`} 
            value={hall.ID_SanhTiec}
          >
            {hall.TenSanh || 'Sảnh không xác định'}
          </Option>
        )) : 
        <Option key="no-halls" value="">Không có sảnh tiệc</Option>
      }
    </Select>
  );
};

export default HallSelectWrapper;
