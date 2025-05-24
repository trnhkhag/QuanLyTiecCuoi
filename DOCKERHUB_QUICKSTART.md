# 🚀 **QLTC Docker Hub Quick Start**

## ⚡ **30-Minute Setup**

### **1. Prerequisites** (5 min)
- ✅ Docker Hub account: https://hub.docker.com
- ✅ Bizfly Cloud Server (Ubuntu 20.04, 4GB RAM)
- ✅ GitHub repository

### **2. One-Command Setup** (15 min)
```bash
# Run automated setup
chmod +x scripts/setup-dockerhub.sh
./scripts/setup-dockerhub.sh
```

### **3. Add GitHub Secrets** (5 min)
- Copy-paste output from setup script
- Go to: GitHub → Settings → Secrets → Actions
- Add all 11 secrets

### **4. Deploy** (5 min)
```bash
git add .
git commit -m "Deploy to Docker Hub"
git push origin main
```

---

## 🎯 **Flow Overview**
```
Local Code → GitHub → Actions → Docker Hub → Bizfly Server
```

## 📊 **Performance**
- **Build**: 3-5 minutes
- **Deploy**: 2-5 minutes
- **Total**: 6-12 minutes

## 🔍 **Check Status**
```bash
# Monitor deployment
./scripts/check-deployment.sh

# Check website
curl http://your-server-ip
curl http://your-server-ip:3001/health
```

## 🆘 **Troubleshoot**
```bash
# SSH to server
ssh root@your-server-ip

# Check containers
docker-compose -f docker-compose.prod.dockerhub.yml logs
docker-compose -f docker-compose.prod.dockerhub.yml ps

# Restart if needed
docker-compose -f docker-compose.prod.dockerhub.yml down
docker-compose -f docker-compose.prod.dockerhub.yml up -d
```

---

## 💰 **Costs**
- **Docker Hub**: FREE
- **Bizfly Server**: ~$30-50/month
- **Total**: ~$30-50/month

**That's it! 🎉**

📖 **Full guide**: [DOCKERHUB_COMPLETE_SETUP.md](DOCKERHUB_COMPLETE_SETUP.md) 