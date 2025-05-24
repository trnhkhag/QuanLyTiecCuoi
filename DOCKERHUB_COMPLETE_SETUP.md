# 🐳 **QLTC - Docker Hub Complete Setup Guide**

## 🚀 **Flow Overview**
```
Local Code → GitHub → GitHub Actions → Docker Hub → Bizfly Cloud Server
```

---

## ✅ **Completed Items**

### 📁 **Files Already Created:**
- ✅ `.github/workflows/docker-prod-dockerhub.yml` - CI/CD workflow
- ✅ `docker-compose.prod.dockerhub.yml` - Production compose file
- ✅ `scripts/setup-production-server.sh` - Server setup script
- ✅ `scripts/generate-secrets.sh` - GitHub secrets helper

---

## 🔧 **Still Need To Complete**

### 1️⃣ **Docker Hub Setup** (5 minutes)

#### **Create Docker Hub Account:**
```bash
# 1. Go to https://hub.docker.com
# 2. Create account or login
# 3. Create repositories:
#    - your-username/qltc-client
#    - your-username/qltc-server
```

#### **Get Docker Hub Credentials:**
```bash
# Username: your-docker-username
# Password: your-docker-password (or access token)
```

### 2️⃣ **GitHub Secrets Setup** (10 minutes)

Run the generator script:
```bash
chmod +x scripts/generate-secrets.sh
./scripts/generate-secrets.sh
```

**Required Secrets (11 total):**
```
# Docker Hub
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password

# Bizfly Server SSH
HOST=your-server-ip
USERNAME=root
PRIVATE_KEY=your-ssh-private-key
PORT=22
PROJECT_PATH=/opt/qltc

# Environment Files
CLIENT_ENV_PRODUCTION=REACT_APP_API_URL=http://your-server-ip:3001
SERVER_ENV_PRODUCTION=NODE_ENV=production
PORT=3001
DB_HOST=mysql
DB_PORT=3306

# Database
DB_PASSWORD=secure_db_password
DB_USER=qltc_user
DB_DATABASE=qltc_database
DB_USER_PASSWORD=secure_user_password
JWT_SECRET=your-jwt-secret-key
```

### 3️⃣ **Bizfly Cloud Server Setup** (15 minutes)

#### **Create Bizfly Cloud Server:**
- **OS**: Ubuntu 20.04 LTS
- **RAM**: 4GB minimum
- **CPU**: 2 cores minimum  
- **Storage**: 40GB minimum
- **Network**: Enable public IP

#### **Setup Server:**
```bash
# 1. SSH to your server
ssh root@your-server-ip

# 2. Download and run setup script
curl -o setup.sh https://raw.githubusercontent.com/your-username/QuanLyTiecCuoi/main/scripts/setup-production-server.sh
chmod +x setup.sh
./setup.sh
```

### 4️⃣ **Project Configuration** (5 minutes)

#### **Update docker-compose.prod.dockerhub.yml:**
```bash
# Verify the file uses Docker Hub images:
# - your-username/qltc-client:latest
# - your-username/qltc-server:latest
```

---

## 🏃‍♂️ **Quick Deploy Steps**

### **Step 1: Setup Docker Hub**
```bash
# Create repositories on Docker Hub:
# - qltc-client
# - qltc-server
```

### **Step 2: Configure GitHub Secrets**
```bash
# Go to GitHub → Settings → Secrets and Variables → Actions
# Add all 11 secrets listed above
```

### **Step 3: Setup Bizfly Server**
```bash
ssh root@your-server-ip
curl -o setup.sh https://raw.githubusercontent.com/your-username/QuanLyTiecCuoi/main/scripts/setup-production-server.sh
chmod +x setup.sh
./setup.sh
```

### **Step 4: First Deploy**
```bash
# Push code to trigger deployment
git add .
git commit -m "Initial Docker Hub deployment"
git push origin main
```

### **Step 5: Verify Deployment**
```bash
# Check your website
http://your-server-ip

# Check backend API
http://your-server-ip:3001/health
```

---

## 📊 **Deployment Performance**

### **Expected Deploy Times:**
- **Build & Push**: 3-5 minutes
- **Server Pull**: 2-5 minutes  
- **Container Start**: 1-2 minutes
- **Total**: 6-12 minutes

### **Test Performance:**
```bash
# Run performance test
chmod +x scripts/performance-test.sh
./scripts/performance-test.sh
```

---

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. Docker Hub Push Failed**
```bash
# Solution: Check Docker Hub credentials
# Verify DOCKER_USERNAME and DOCKER_PASSWORD in GitHub Secrets
```

#### **2. Server Connection Failed**
```bash
# Solution: Check SSH configuration
# Verify HOST, USERNAME, PRIVATE_KEY in GitHub Secrets
```

#### **3. Container Start Failed**
```bash
# Solution: Check server resources
ssh root@your-server-ip
docker-compose -f docker-compose.prod.dockerhub.yml logs
```

#### **4. Website Not Accessible**
```bash
# Solution: Check firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 3001
```

---

## 🎯 **Next Steps**

### **After Successful Deployment:**

1. **Setup Domain** (Optional)
   ```bash
   # Point your domain to server IP
   # Update Nginx configuration for domain
   ```

2. **Enable HTTPS** (Recommended)
   ```bash
   # Install Let's Encrypt SSL
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

3. **Setup Monitoring** (Optional)
   ```bash
   # Add monitoring tools
   # Setup log aggregation
   ```

4. **Database Backup** (Important)
   ```bash
   # Setup automated backups
   # Test backup/restore procedures
   ```

---

## 💰 **Cost Analysis**

### **Monthly Costs:**
- **Bizfly Cloud Server**: ~$30-50/month
- **Docker Hub**: FREE (for public repos)
- **Domain**: ~$10-15/year
- **SSL Certificate**: FREE (Let's Encrypt)

### **Total Monthly**: ~$30-50

---

## 🚀 **Ready to Deploy?**

Run this command to start:
```bash
# Generate GitHub Secrets
./scripts/generate-secrets.sh

# Then follow the output instructions
```

**Estimated Setup Time**: 30-45 minutes
**First Deploy Time**: 10-15 minutes

---

## 📞 **Support**

If you encounter issues:
1. Check GitHub Actions logs
2. SSH to server and check `docker-compose logs`
3. Verify all secrets are set correctly
4. Run performance test script

**Happy Deploying! 🎉** 