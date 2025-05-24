const multer = require('multer');
const path = require('path');

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Sử dụng đường dẫn tuyệt đối thay vì đường dẫn tương đối
    const uploadPath = path.join(__dirname, '../../uploads/halls/');
    console.log('Upload directory:', uploadPath);
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const fileName = 'hall-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated file name:', fileName);
    cb(null, fileName)
  }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Không phải file hình ảnh!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

module.exports = upload;