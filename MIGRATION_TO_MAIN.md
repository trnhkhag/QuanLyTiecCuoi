# Migration từ Auto-Deploy sang Main Branch

## 📋 **Overview**

Hướng dẫn chuyển từ branch `auto-deploy` sang `main` với CI/CD production deployment sử dụng SSH config đã setup.

## 🎯 **Những gì đã được chuẩn bị**

### ✅ **Files đã được tạo:**
1. `.github/workflows/main-production-ci.yml` - Main CI/CD workflow
2. `client/nginx.conf` - Nginx config cho React SPA
3. `client/Dockerfile` - Updated để sử dụng nginx config
4. `docker-compose.prod.yml` - Production docker compose (đã có)

### ✅ **GitHub Secrets đã có sẵn:**
- `DOCKER_USERNAME` & `DOCKER_PASSWORD`
- `HOST`, `USERNAME`, `PORT`, `PROJECT_PATH`
- `PRIVATE_KEY` (SSH key đã fix)
- `DB_PASSWORD`, `DB_USER`, `DB_DATABASE`, `DB_USER_PASSWORD`
- `JWT_SECRET`

## 🚀 **Steps để Migration**

### **Step 1: Merge code từ auto-deploy**
```bash
# Checkout main branch
git checkout main

# Merge auto-deploy changes
git merge auto-deploy

# Push to main
git push origin main
```

### **Step 2: Test CI/CD**
- Push sẽ trigger workflow `.github/workflows/main-production-ci.yml`
- Workflow sẽ:
  1. Build Docker images với nginx config
  2. Push images lên Docker Hub với tag `latest` và commit SHA
  3. SSH vào server và deploy

### **Step 3: Monitoring**
- Check GitHub Actions: https://github.com/quanlytieccuoi-team/QuanLyTiecCuoi/actions
- Monitor deployment logs
- Verify website: http://103.153.72.156

## 🔧 **Improvements so với auto-deploy**

### **🎯 Fixed Issues:**
1. **Nginx SPA Routing**: Các routes như `/login`, `/register` sẽ hoạt động
2. **Health Checks**: Built-in health monitoring
3. **Proper Environment**: REACT_APP_API_URL được set đúng tại build time
4. **Detailed Logs**: Deployment logs chi tiết hơn

### **🔄 Branch Strategy:**
- `main` branch: Production deployment
- `develop` branch: Development (có thể dùng existing dev workflow)
- Feature branches: Develop từ `develop`, merge vào `develop`

## 📊 **GitHub Secrets Required**

**All secrets are already configured từ auto-deploy setup:**

```
# Docker Hub
DOCKER_USERNAME=hoang636
DOCKER_PASSWORD=<docker-hub-password>

# Server SSH
HOST=103.153.72.156
USERNAME=root
PORT=22
PROJECT_PATH=/opt/qltc/QuanLyTiecCuoi
PRIVATE_KEY=<ssh-private-key>

# Database
DB_PASSWORD=cpmFV0MxELG9ehwlrpeY0YFxl
DB_USER=qltc_user
DB_DATABASE=qltc_database
DB_USER_PASSWORD=qHRd0UPeaYkDYRCUScFUKAsvF
JWT_SECRET=IavS3GI3pUEByVDbPEWRYwitEnkWYXH42qbZNEOK3ptgrdJHnqHqnH3MaIJ8ZxHnsmcvjg
```

## 🎉 **Ready to Deploy!**

After merging to `main`, the deployment will be automatic. The website will be available at:
**http://103.153.72.156**

## 🆘 **Troubleshooting**

### **Nếu SSH fail:**
```bash
# Manual deployment trên server
cd /opt/qltc/QuanLyTiecCuoi
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### **Nếu containers restart:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs qltc-client
docker-compose -f docker-compose.prod.yml logs qltc-server
```

**The setup is ready! Just merge auto-deploy to main and push!** 🚀 