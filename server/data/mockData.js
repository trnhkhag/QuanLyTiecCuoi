// Mock data cho testing khi database không có sẵn

const mockData = {
  halls: [
    { id: 1, name: 'Diamond Hall', capacity: 500, price: 50000000 },
    { id: 2, name: 'Ruby Hall', capacity: 300, price: 30000000 },
    { id: 3, name: 'Emerald Hall', capacity: 200, price: 20000000 }
  ],
  foods: [
    { id: 1, name: 'Gỏi cuốn tôm thịt', price: 120000, category: 'Khai vị' },
    { id: 2, name: 'Súp hải sản', price: 150000, category: 'Khai vị' },
    { id: 3, name: 'Cá hồi nướng', price: 280000, category: 'Món chính' }
  ],
  services: [
    { id: 1, name: 'Trang trí hoa tươi', price: 5000000, description: 'Bao gồm cổng và bàn tiệc' },
    { id: 2, name: 'Ban nhạc sống', price: 8000000, description: '4 nhạc công, 2 giờ biểu diễn' },
    { id: 3, name: 'MC chuyên nghiệp', price: 3000000, description: 'MC song ngữ Việt - Anh' }
  ]
};

module.exports = mockData;