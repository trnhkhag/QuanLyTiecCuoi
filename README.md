# Quản Lý Tiệc Cưới

Hệ thống quản lý tiệc cưới được xây dựng với React, Node.js và MySQL.

## Cài đặt và Chạy

Có 2 cách để chạy project:

### Cách 1: Clone từ GitHub và sử dụng Docker Compose

1. Clone repository:
```bash
git clone https://github.com/your-username/QuanLyTiecCuoi.git
cd QuanLyTiecCuoi
```

2. Đảm bảo Docker Desktop đã được cài đặt và đang chạy

3. Chạy project bằng Docker Compose:
```bash
# Build và chạy tất cả services
docker-compose up -d

# Hoặc chạy từng service
docker-compose up mysql
docker-compose up qltc-server
docker-compose up qltc-client
```

4. Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MySQL: localhost:3306

### Cách 2: Pull Docker Images và chạy riêng lẻ

1. Pull các images cần thiết:
```bash
docker pull qltc/qltc-client-dev:latest
docker pull qltc/qltc-server-dev:latest
docker pull mysql:8.0
```

2. Tạo network cho các containers:
```bash
docker network create qltc-network
```

3. Chạy MySQL:
```bash
docker run -d \
  --name mysql \
  --network qltc-network \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=Admin12345 \
  -e MYSQL_DATABASE=TiecCuoiDB \
  -v ./Database/init:/docker-entrypoint-initdb.d \
  mysql:8.0
```

4. Chạy Backend:
```bash
docker run -d \
  --name qltc-server \
  --network qltc-network \
  -p 3001:3001 \
  -e NODE_ENV=development \
  -e DB_HOST=mysql \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASSWORD=Admin12345 \
  -e DB_DATABASE=TiecCuoiDB \
  qltc/qltc-server-dev:latest
```

5. Chạy Frontend:
```bash
docker run -d \
  --name qltc-client \
  --network qltc-network \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e REACT_APP_API_URL=http://localhost:3001/api \
  qltc/qltc-client-dev:latest
```

## Các lệnh Docker hữu ích

### Docker Compose
```bash
# Xem logs
docker-compose logs -f

# Dừng tất cả services
docker-compose down

# Restart một service
docker-compose restart qltc-server

# Xem trạng thái
docker-compose ps
```

### Docker Run
```bash
# Xem logs của container
docker logs -f qltc-server

# Dừng container
docker stop qltc-server

# Xóa container
docker rm qltc-server

# Xem trạng thái containers
docker ps
```

## Troubleshooting

1. Kiểm tra network:
```bash
docker network ls
docker network inspect qltc-network
```

2. Kiểm tra volumes:
```bash
docker volume ls
docker volume inspect mysql-data
```

3. Xem logs chi tiết:
```bash
# Với Docker Compose
docker-compose logs -f

# Với Docker Run
docker logs -f mysql
docker logs -f qltc-server
docker logs -f qltc-client
```

## Lưu ý

- Đảm bảo ports 3000, 3001, 3306 không bị sử dụng
- Đảm bảo Docker Desktop đang chạy
- Đảm bảo có đủ quyền truy cập vào thư mục project
- Với cách 2, cần đảm bảo thứ tự chạy: MySQL -> Backend -> Frontend
