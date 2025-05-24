# QLTC Quick Start Deployment

## 🚀 Deployment Overview

```
Local Development → GitHub → GitHub Actions → Docker Hub → Cloud Server
```

## ⚡ Quick Setup

### 1. Cloud Server Setup

```bash
# Run on your cloud server
curl -L https://raw.githubusercontent.com/your-repo/main/scripts/setup-production-server.sh -o setup.sh
chmod +x setup.sh
./setup.sh

# Clone your repo
cd /opt/qltc
git clone https://github.com/your-username/your-repo.git .
```

### 2. GitHub Secrets Configuration

Go to GitHub → Settings → Secrets → Actions:

```
# Docker Hub
DOCKER_USERNAME: your-dockerhub-username
DOCKER_PASSWORD: your-dockerhub-password

# Server SSH
HOST: your-server-ip
USERNAME: your-server-username  
PRIVATE_KEY: your-ssh-private-key
PORT: 22
PROJECT_PATH: /opt/qltc

# Environment Variables
CLIENT_ENV_PRODUCTION: |
  REACT_APP_API_URL=http://your-domain.com/api
  REACT_APP_ENV=production

SERVER_ENV_PRODUCTION: |
  NODE_ENV=production
  PORT=3001
  JWT_SECRET=your-jwt-secret
  DB_HOST=mysql
  DB_PORT=3306

# Database & App Secrets
DB_PASSWORD: your-secure-db-password
JWT_SECRET: your-secure-jwt-secret
```

### 3. Environment File

Create `.env.production` on your server:

```bash
nano /opt/qltc/.env.production
```

```env
DOCKER_USERNAME=your-dockerhub-username
IMAGE_TAG=latest
DB_PASSWORD=your-secure-db-password
DB_USER=root
DB_DATABASE=TiecCuoiDB
DB_USER_PASSWORD=user-password
JWT_SECRET=your-secure-jwt-secret
```

### 4. Deploy

```bash
# Push to main branch
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions will automatically:
✅ Build Docker images  
✅ Push to Docker Hub  
✅ Deploy to your server  

## 📊 Monitor

```bash
# Check service status
/opt/qltc/monitor.sh

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Manual backup
/opt/qltc/backup.sh
```

## 🔗 URLs

- **Frontend**: http://your-server-ip
- **Backend API**: http://your-server-ip:3001/api
- **API Docs**: http://your-server-ip:3001/api-docs
- **Health Check**: http://your-server-ip:3001/health

## 🆘 Troubleshooting

```bash
# Restart services
sudo systemctl restart qltc

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Reset deployment
docker-compose -f docker-compose.prod.yml down -v
docker system prune -af
docker-compose -f docker-compose.prod.yml up -d
```

📖 **Full Documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 