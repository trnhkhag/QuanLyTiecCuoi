# QLTC Deployment Guide

## Tổng quan

Hướng dẫn này sẽ giúp bạn deploy project QLTC (Quản Lý Tiệc Cưới) lên cloud server với CI/CD pipeline hoàn chỉnh.

## Architecture

```
GitHub → GitHub Actions → Docker Hub → Cloud Server
```

- **Development**: Push vào `develop/feature/*` → build dev images
- **Production**: Push vào `main/master` → build production images và deploy

## 1. Chuẩn bị Cloud Server

### 1.1. Setup Server

Chạy script setup trên cloud server:

```bash
# Download và chạy setup script
curl -L https://raw.githubusercontent.com/your-repo/main/scripts/setup-production-server.sh -o setup.sh
chmod +x setup.sh
./setup.sh
```

### 1.2. Clone Repository

```bash
cd /opt/qltc
git clone https://github.com/your-username/your-repo.git .
```

### 1.3. Tạo file .env.production

```bash
nano .env.production
```

```env
# Docker Configuration
DOCKER_USERNAME=your-docker-username
IMAGE_TAG=latest

# Database Configuration
DB_PASSWORD=your-secure-password
DB_USER=root
DB_DATABASE=TiecCuoiDB
DB_USER_PASSWORD=user-password

# Application Configuration
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

## 2. Cấu hình GitHub Secrets

Vào GitHub → Settings → Secrets and variables → Actions → New repository secret

### 2.1. Docker Hub Secrets

```
DOCKER_USERNAME: your-docker-username
DOCKER_PASSWORD: your-docker-password
```

### 2.2. Server Connection Secrets

```
HOST: your-server-ip
USERNAME: your-server-username
PRIVATE_KEY: your-ssh-private-key
PORT: 22
PROJECT_PATH: /opt/qltc
```

### 2.3. Environment Secrets

```
CLIENT_ENV_PRODUCTION: |
  REACT_APP_API_URL=http://your-domain.com/api
  REACT_APP_ENV=production

SERVER_ENV_PRODUCTION: |
  NODE_ENV=production
  PORT=3001
  JWT_SECRET=your-jwt-secret
  DB_HOST=mysql
  DB_PORT=3306

PRODUCTION_ENV: |
  DOCKER_USERNAME=your-docker-username
  IMAGE_TAG=latest
  DB_PASSWORD=your-secure-password
  DB_USER=root
  DB_DATABASE=TiecCuoiDB
  DB_USER_PASSWORD=user-password
  JWT_SECRET=your-jwt-secret

# Database secrets
DB_PASSWORD: your-secure-password
DB_USER: root
DB_DATABASE: TiecCuoiDB
DB_USER_PASSWORD: user-password
JWT_SECRET: your-jwt-secret
```

## 3. Setup SSH Keys

### 3.1. Tạo SSH Key trên máy local

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/qltc_deploy
```

### 3.2. Copy public key lên server

```bash
ssh-copy-id -i ~/.ssh/qltc_deploy.pub user@your-server-ip
```

### 3.3. Thêm private key vào GitHub Secrets

```bash
cat ~/.ssh/qltc_deploy
```

Copy toàn bộ nội dung (bao gồm `-----BEGIN...` và `-----END...`) vào GitHub Secret `PRIVATE_KEY`.

## 4. Nginx Configuration (Optional)

Nếu muốn sử dụng domain name và SSL:

### 4.1. Cài đặt Nginx

```bash
sudo apt install nginx certbot python3-certbot-nginx
```

### 4.2. Tạo Nginx config

```bash
sudo nano /etc/nginx/sites-available/qltc
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.3. Enable site và SSL

```bash
sudo ln -s /etc/nginx/sites-available/qltc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 5. Deploy Process

### 5.1. Manual Deployment

```bash
cd /opt/qltc

# Pull latest changes
git pull origin main

# Deploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### 5.2. Automatic Deployment

Push code lên branch `main`:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions sẽ tự động:
1. Build Docker images
2. Push lên Docker Hub
3. Deploy lên server

## 6. Monitoring & Maintenance

### 6.1. Health Check

```bash
# Manual check
/opt/qltc/monitor.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 6.2. Backup Database

```bash
# Manual backup
/opt/qltc/backup.sh

# View backups
ls -la /opt/qltc/backups/
```

### 6.3. Service Management

```bash
# Start/Stop services
sudo systemctl start qltc
sudo systemctl stop qltc
sudo systemctl status qltc

# View service logs
journalctl -u qltc -f
```

## 7. Troubleshooting

### 7.1. Common Issues

**Container không start:**
```bash
docker-compose -f docker-compose.prod.yml logs
```

**Database connection failed:**
```bash
docker exec -it $(docker-compose -f docker-compose.prod.yml ps -q mysql) mysql -u root -p
```

**Frontend không load:**
```bash
curl -I http://localhost:80
```

**Backend API errors:**
```bash
curl -I http://localhost:3001/api/health
```

### 7.2. Reset Deployment

```bash
# Stop all containers
docker-compose -f docker-compose.prod.yml down -v

# Remove all images
docker system prune -af

# Redeploy
docker-compose -f docker-compose.prod.yml up -d
```

## 8. Performance Optimization

### 8.1. Docker Resource Limits

Đã cấu hình trong `docker-compose.prod.yml`:
- Server: 1 CPU, 1GB RAM
- Database: 1 CPU, 2GB RAM

### 8.2. Database Optimization

```sql
-- Tối ưu MySQL
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL max_connections = 100;
```

### 8.3. Log Management

Logs được rotate tự động:
- Application logs: `/opt/qltc/logs/`
- Monitor logs: crontab mỗi 5 phút
- Backup logs: crontab mỗi ngày lúc 2h sáng

## 9. Security Checklist

- [ ] Firewall configured (ports 22, 80, 443)
- [ ] SSH key authentication only
- [ ] Strong database passwords
- [ ] Environment variables secured
- [ ] Regular security updates
- [ ] SSL/TLS certificate installed
- [ ] Regular database backups

## 10. Support

Nếu gặp vấn đề:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Check health: `/opt/qltc/monitor.sh`
3. Check GitHub Actions logs
4. Contact team support 