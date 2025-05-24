# 🎯 QLTC - Hướng dẫn Deploy từng bước

## ✅ **BƯỚC 1: Chuẩn bị Bizfly Container Registry**

### 1.1. Tạo Container Registry
1. Truy cập: https://manage.bizflycloud.vn/container-registry/
2. Nhấn **"Tạo mới"** → **"Container Registry"**
3. Tạo 2 repositories:
   - Repository name: `qltc-client`
   - Repository name: `qltc-server`

### 1.2. Lấy thông tin Registry
Sau khi tạo, bạn sẽ có URI dạng:
```
cr-hn-1.bizflycloud.vn/<unique-id>/qltc-client
cr-hn-1.bizflycloud.vn/<unique-id>/qltc-server
```

**📝 LƯU LẠI THÔNG TIN SAU:**
- `BIZFLY_USERNAME`: username Bizfly của bạn
- `BIZFLY_PASSWORD`: password Bizfly của bạn  
- `BIZFLY_UNIQUE_ID`: phần `<unique-id>` trong URI (ví dụ: `c9e4fdedcbe641cf90bb1f58c0e641a8`)

### 1.3. Test đăng nhập (optional)
```bash
docker login cr-hn-1.bizflycloud.vn
# Nhập username/password Bizfly
```

---

## ✅ **BƯỚC 2: Chuẩn bị Cloud Server**

### 2.1. Tạo Cloud Server trên Bizfly
1. Truy cập: https://manage.bizflycloud.vn/server/
2. Tạo server với cấu hình tối thiểu:
   - **OS**: Ubuntu 20.04/22.04
   - **RAM**: 4GB+
   - **CPU**: 2 core+
   - **Disk**: 40GB+

### 2.2. Setup SSH Key
```bash
# Tạo SSH key cho deployment
ssh-keygen -t rsa -b 4096 -f ~/.ssh/qltc_deploy -C "qltc-deploy"

# Copy public key lên server
ssh-copy-id -i ~/.ssh/qltc_deploy.pub root@YOUR_SERVER_IP
```

### 2.3. Setup Server Environment
SSH vào server và chạy script setup:

```bash
# SSH vào server
ssh -i ~/.ssh/qltc_deploy root@YOUR_SERVER_IP

# Download setup script
curl -L https://raw.githubusercontent.com/your-repo/main/scripts/setup-production-server.sh -o setup.sh
chmod +x setup.sh
./setup.sh

# Clone repository
cd /opt/qltc
git clone https://github.com/your-username/your-repo.git .
```

**📝 LƯU LẠI THÔNG TIN SAU:**
- `HOST`: IP address của cloud server
- `USERNAME`: username để SSH (thường là `root`)
- `PRIVATE_KEY`: nội dung file `~/.ssh/qltc_deploy` (private key)

---

## ✅ **BƯỚC 3: Cấu hình GitHub Secrets**

Vào GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 3.1. Bizfly Container Registry Secrets
```
BIZFLY_USERNAME
Value: your-bizfly-username

BIZFLY_PASSWORD  
Value: your-bizfly-password

BIZFLY_UNIQUE_ID
Value: your-unique-id-from-registry-uri
```

### 3.2. Server Connection Secrets
```
HOST
Value: your-server-ip

USERNAME
Value: root

PRIVATE_KEY
Value: [Copy toàn bộ nội dung file ~/.ssh/qltc_deploy]

PORT
Value: 22

PROJECT_PATH
Value: /opt/qltc
```

### 3.3. Environment Variables Secrets
```
CLIENT_ENV_PRODUCTION
Value: |
REACT_APP_API_URL=http://your-server-ip:3001/api
REACT_APP_ENV=production

SERVER_ENV_PRODUCTION  
Value: |
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=mysql
DB_PORT=3306

DB_PASSWORD
Value: YourSecureDBPassword123!

DB_USER
Value: root

DB_DATABASE
Value: TiecCuoiDB

DB_USER_PASSWORD
Value: YourDBUserPassword123!

JWT_SECRET
Value: your-super-secret-jwt-key-here
```

---

## ✅ **BƯỚC 4: Tạo Environment File trên Server**

SSH vào server và tạo file `.env.production`:

```bash
ssh -i ~/.ssh/qltc_deploy root@YOUR_SERVER_IP
cd /opt/qltc

# Tạo file .env.production
nano .env.production
```

Nội dung file `.env.production`:
```env
BIZFLY_REGISTRY=cr-hn-1.bizflycloud.vn
BIZFLY_UNIQUE_ID=your-unique-id-here
IMAGE_TAG=latest
DB_PASSWORD=YourSecureDBPassword123!
DB_USER=root
DB_DATABASE=TiecCuoiDB
DB_USER_PASSWORD=YourDBUserPassword123!
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

---

## ✅ **BƯỚC 5: Test Manual Deploy (Optional)**

Trước khi setup CI/CD, test deploy thủ công:

```bash
# Trên server
cd /opt/qltc

# Login vào Bizfly Registry
docker login cr-hn-1.bizflycloud.vn

# Thử chạy services (sẽ build local lần đầu)
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## ✅ **BƯỚC 6: Deploy qua CI/CD**

### 6.1. Push code lên GitHub
```bash
# Trên máy local
git add .
git commit -m "Setup production deployment with Bizfly"
git push origin main
```

### 6.2. Monitor GitHub Actions
1. Vào GitHub repository
2. Click tab **Actions**
3. Xem workflow **"Production Docker CI/CD"** đang chạy

### 6.3. Verify deployment
```bash
# SSH vào server check
ssh -i ~/.ssh/qltc_deploy root@YOUR_SERVER_IP
cd /opt/qltc

# Check containers status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs

# Test endpoints
curl http://localhost:80
curl http://localhost:3001/health
```

---

## ✅ **BƯỚC 7: Access Application**

Sau khi deploy thành công:

- **Frontend**: http://YOUR_SERVER_IP
- **Backend API**: http://YOUR_SERVER_IP:3001/api  
- **API Documentation**: http://YOUR_SERVER_IP:3001/api-docs
- **Health Check**: http://YOUR_SERVER_IP:3001/health

---

## ✅ **BƯỚC 8: Setup Monitoring (Optional)**

### 8.1. Health Monitoring
```bash
# Trên server, setup cron job để monitor
crontab -e

# Thêm dòng sau:
*/5 * * * * /opt/qltc/monitor.sh >> /opt/qltc/logs/monitor.log 2>&1
```

### 8.2. Database Backup
```bash
# Setup daily backup
crontab -e

# Thêm dòng sau:
0 2 * * * /opt/qltc/backup.sh >> /opt/qltc/logs/backup.log 2>&1
```

### 8.3. Setup SSL với Domain (Optional)
Nếu có domain name:

```bash
# Install nginx và certbot
sudo apt install nginx certbot python3-certbot-nginx

# Setup reverse proxy
sudo nano /etc/nginx/sites-available/qltc

# Enable site
sudo ln -s /etc/nginx/sites-available/qltc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate  
sudo certbot --nginx -d yourdomain.com
```

---

## 🚨 **Troubleshooting Common Issues**

### Issue 1: Container Registry Login Failed
```bash
# Check credentials
docker login cr-hn-1.bizflycloud.vn
```

### Issue 2: Images not found
```bash
# Verify image tags match
docker images | grep qltc
```

### Issue 3: Database connection failed
```bash
# Check database container
docker logs $(docker ps -q -f name=mysql)
```

### Issue 4: GitHub Actions failed
1. Check GitHub Secrets are correct
2. Check syntax in workflow file
3. Check server SSH connectivity

---

## 📞 **Checklist hoàn thành**

- [ ] ✅ Bizfly Container Registry created (2 repos)
- [ ] ✅ Cloud Server created and accessible  
- [ ] ✅ SSH key configured
- [ ] ✅ GitHub Secrets configured (8 secrets)
- [ ] ✅ Environment file created on server
- [ ] ✅ GitHub Actions workflow successful
- [ ] ✅ Application accessible via browser
- [ ] ✅ Health checks passing
- [ ] ✅ Monitoring setup (optional)
- [ ] ✅ SSL certificate (optional)

**🎉 Congratulations! Your QLTC application is now deployed with full CI/CD pipeline!** 