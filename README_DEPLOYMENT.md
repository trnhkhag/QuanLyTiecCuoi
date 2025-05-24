# 🎯 QLTC Deployment & CI/CD System

## 📖 Tổng quan

Hệ thống CI/CD hoàn chỉnh cho project **Quản Lý Tiệc Cưới (QLTC)** sử dụng:
- **Bizfly Container Registry** - Lưu trữ Docker images
- **Bizfly Cloud Server** - Server production  
- **GitHub Actions** - CI/CD pipeline
- **Docker Compose** - Container orchestration

## 🚀 Architecture

```
Local Development → GitHub Push → GitHub Actions → Bizfly Registry → Cloud Server
```

## 📁 Files đã tạo

### Core Deployment Files
- `docker-compose.prod.yml` - Production Docker Compose config
- `.github/workflows/docker-prod-ci.yml` - GitHub Actions workflow

### Documentation & Guides  
- `STEP_BY_STEP_GUIDE.md` - 📋 **HỌC THEO ĐÂY** - Hướng dẫn từng bước chi tiết
- `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy đầy đủ
- `QUICK_START.md` - Hướng dẫn nhanh

### Scripts & Tools
- `scripts/setup-production-server.sh` - Setup tự động cloud server
- `scripts/generate-secrets.sh` - Tool tạo GitHub Secrets
- `client/nginx.conf` - Nginx config cho React app

## 🎯 **BƯỚC TIẾP THEO CỦA BẠN**

### 1. ⭐ **BẮT ĐẦU TẠI ĐÂY**
Đọc và làm theo: **`STEP_BY_STEP_GUIDE.md`**

### 2. 🔧 **Sử dụng tool generate secrets**
```bash
# Trên máy local (Git Bash hoặc WSL)
./scripts/generate-secrets.sh
```

### 3. 🏗️ **Thực hiện setup từng bước**
1. Tạo Bizfly Container Registry
2. Tạo Cloud Server
3. Setup SSH keys
4. Cấu hình GitHub Secrets
5. Deploy!

## 🔗 **Bizfly Services URLs**

- **Container Registry**: https://manage.bizflycloud.vn/container-registry/
- **Cloud Server**: https://manage.bizflycloud.vn/server/
- **Management Dashboard**: https://manage.bizflycloud.vn/

## 📊 **Sau khi deploy thành công**

### Application URLs
- **Frontend**: `http://YOUR_SERVER_IP`
- **Backend API**: `http://YOUR_SERVER_IP:3001/api`  
- **API Documentation**: `http://YOUR_SERVER_IP:3001/api-docs`
- **Health Check**: `http://YOUR_SERVER_IP:3001/health`

### Monitoring Commands
```bash
# Check service status
/opt/qltc/monitor.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Manual backup  
/opt/qltc/backup.sh
```

## 🔄 **CI/CD Flow**

### Development
```bash
git checkout develop
git add .
git commit -m "feature: new functionality"
git push origin develop
# → Triggers dev image build
```

### Production  
```bash
git checkout main
git merge develop
git push origin main
# → Triggers production build & deploy
```

## 🛡️ **Security Features**

- ✅ SSH key authentication
- ✅ Firewall configured (UFW)
- ✅ Environment variables secured
- ✅ Container resource limits
- ✅ Health checks enabled
- ✅ Nginx security headers
- ✅ Database credentials encrypted

## 📈 **Performance Optimizations**

- ✅ Multi-stage Docker builds
- ✅ Docker layer caching
- ✅ Nginx gzip compression
- ✅ Static asset caching
- ✅ Resource limits configured
- ✅ Database connection pooling

## 🆘 **Support & Troubleshooting**

### Quick Debug Commands
```bash
# Container status
docker-compose -f docker-compose.prod.yml ps

# Container logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# System resources
htop
df -h
docker system df

# Network connectivity
curl -I http://localhost:80
curl -I http://localhost:3001/health
```

### Common Issues & Solutions
1. **Registry login failed** → Check Bizfly credentials
2. **Images not found** → Verify image tags and registry URL
3. **Database connection failed** → Check MySQL container logs
4. **GitHub Actions failed** → Verify all secrets are set correctly

## 🎉 **Features**

### ✅ Completed
- [x] Production Docker configuration
- [x] Bizfly Container Registry integration
- [x] GitHub Actions CI/CD pipeline
- [x] Health monitoring system
- [x] Automated database backup
- [x] Security hardening
- [x] Resource optimization
- [x] Complete documentation

### 🔮 Future Enhancements
- [ ] Blue-green deployment
- [ ] Kubernetes migration  
- [ ] Log aggregation (ELK stack)
- [ ] Prometheus monitoring
- [ ] SSL certificate automation
- [ ] Multi-environment staging

---

## 📞 **Need Help?**

1. **Start with**: `STEP_BY_STEP_GUIDE.md`
2. **Generate secrets**: `./scripts/generate-secrets.sh`
3. **Check logs**: `docker-compose -f docker-compose.prod.yml logs`
4. **Monitor health**: `/opt/qltc/monitor.sh`

**🎯 Goal**: Có một hệ thống production hoàn chỉnh với CI/CD tự động!** 