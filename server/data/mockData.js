// Mock data cho testing khi database không có sẵn

const mockData = {
  // Wedding Halls Data
  halls: [
    {
      id: 1,
      MA_SANH: "SA01",
      TEN_SANH: "Sảnh Kim Cương",
      SUC_CHUA: 500,
      GIA_TOI_THIEU: 5000000,
      LOAI_SANH: "A",
      hinh_anh: "/images/halls/diamond-hall.jpg",
      mo_ta: "Sảnh cưới sang trọng bậc nhất, phù hợp cho những đám cưới lớn và đẳng cấp."
    },
    {
      id: 2,
      MA_SANH: "SA02",
      TEN_SANH: "Sảnh Hồng Ngọc",
      SUC_CHUA: 300,
      GIA_TOI_THIEU: 3000000,
      LOAI_SANH: "B",
      hinh_anh: "/images/halls/ruby-hall.jpg",
      mo_ta: "Không gian ấm cúng, lãng mạn với tông màu đỏ chủ đạo."
    },
    {
      id: 3,
      MA_SANH: "SA03",
      TEN_SANH: "Sảnh Ánh Dương",
      SUC_CHUA: 200,
      GIA_TOI_THIEU: 2000000,
      LOAI_SANH: "C",
      hinh_anh: "/images/halls/sunshine-hall.jpg",
      mo_ta: "Sảnh nhỏ, tràn ngập ánh sáng tự nhiên, thích hợp cho đám cưới nhỏ."
    }
  ],
  
  // Wedding Shifts
  shifts: [
    { id: 1, ten_ca: "Sáng", thoi_gian: "9:00 - 13:00" },
    { id: 2, ten_ca: "Chiều", thoi_gian: "14:00 - 18:00" },
    { id: 3, ten_ca: "Tối", thoi_gian: "18:30 - 22:30" }
  ],
  
  // Food Menu Options
  foods: [
    {
      id: 1,
      ten_mon: "Gỏi cuốn tôm thịt",
      loai: "khai_vi",
      don_gia: 50000,
      hinh_anh: "/images/foods/goi-cuon.jpg"
    },
    {
      id: 2,
      ten_mon: "Súp cua măng tây",
      loai: "sup",
      don_gia: 70000,
      hinh_anh: "/images/foods/sup-cua.jpg"
    },
    {
      id: 3,
      ten_mon: "Cá hồi áp chảo sốt chanh dây",
      loai: "mon_chinh",
      don_gia: 150000,
      hinh_anh: "/images/foods/ca-hoi.jpg"
    },
    {
      id: 4,
      ten_mon: "Bò Úc nướng sốt tiêu đen",
      loai: "mon_chinh",
      don_gia: 200000,
      hinh_anh: "/images/foods/bo-uc.jpg"
    },
    {
      id: 5,
      ten_mon: "Chè hạt sen long nhãn",
      loai: "trang_mieng",
      don_gia: 40000,
      hinh_anh: "/images/foods/che-hat-sen.jpg"
    }
  ],
  
  // Additional Services
  services: [
    {
      id: 1,
      ten_dich_vu: "Trang trí cổng hoa",
      mo_ta: "Cổng hoa trang trí theo chủ đề",
      don_gia: 2000000,
      hinh_anh: "/images/services/cong-hoa.jpg"
    },
    {
      id: 2,
      ten_dich_vu: "Ban nhạc acoustic",
      mo_ta: "Ban nhạc biểu diễn trong 2 giờ",
      don_gia: 3000000,
      hinh_anh: "/images/services/ban-nhac.jpg"
    },
    {
      id: 3,
      ten_dich_vu: "Xe hoa cô dâu",
      mo_ta: "Xe hoa sang trọng đưa đón cô dâu",
      don_gia: 1500000,
      hinh_anh: "/images/services/xe-hoa.jpg"
    },
    {
      id: 4,
      ten_dich_vu: "MC dẫn chương trình",
      mo_ta: "MC chuyên nghiệp dẫn dắt tiệc cưới",
      don_gia: 2500000,
      hinh_anh: "/images/services/mc.jpg"
    },
    {
      id: 5,
      ten_dich_vu: "Chụp ảnh & quay phim",
      mo_ta: "Gói chụp ảnh và quay phim trọn gói",
      don_gia: 5000000,
      hinh_anh: "/images/services/photo-video.jpg"
    }
  ],
  
  // Sample Bookings
  bookings: [
    {
      id: 1,
      customerId: 101,
      customerName: "Nguyễn Văn An",
      hallId: 1,
      hallName: "Sảnh Kim Cương",
      weddingDate: "2024-06-15",
      shiftId: 2,
      shiftName: "Chiều",
      tableCount: 30,
      reserveTableCount: 2,
      deposit: 10000000,
      status: "confirmed",
      createdAt: "2024-01-10T08:30:00Z",
      services: [1, 4, 5],
      foods: [1, 2, 3, 5]
    },
    {
      id: 2,
      customerId: 102,
      customerName: "Trần Thị Bình",
      hallId: 2,
      hallName: "Sảnh Hồng Ngọc",
      weddingDate: "2024-05-20",
      shiftId: 3,
      shiftName: "Tối",
      tableCount: 25,
      reserveTableCount: 1,
      deposit: 8000000,
      status: "pending",
      createdAt: "2024-01-15T10:15:00Z",
      services: [2, 5],
      foods: [2, 4, 5]
    }
  ],
  
  // Regulations
  regulations: [
    {
      ID_QuyDinh: "QD1",
      TenQuyDinh: "Quy định về đơn giá theo loại sảnh",
      MoTa: "Quy định về giá tối thiểu cho từng loại sảnh",
      details: {
        halls: [
          { type: "A", minPrice: 5000000 },
          { type: "B", minPrice: 3000000 },
          { type: "C", minPrice: 2000000 }
        ]
      }
    },
    {
      ID_QuyDinh: "QD2",
      TenQuyDinh: "Quy định về số lượng dịch vụ và món ăn",
      MoTa: "Giới hạn số lượng dịch vụ và món ăn cho mỗi tiệc",
      details: {
        maxServices: 5,
        maxDishes: 10
      }
    },
    {
      ID_QuyDinh: "QD4",
      TenQuyDinh: "Quy định về phí phạt",
      MoTa: "Quy định về phí phạt khi thay đổi hoặc hủy tiệc",
      details: {
        lateFeePercentage: 10,
        enabled: true
      }
    }
  ]
};

module.exports = mockData;