# CI/CD Setup Guide

## GitHub Secrets Required

### Docker Hub Configuration
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password/token

### Server Configuration
- `HOST`: Server IP address (currently: 34.70.80.83)
- `USERNAME`: SSH username for server access
- `PORT`: SSH port (default: 22)
- `PRIVATE_KEY`: SSH private key content (Google Cloud SSH key)
- `PROJECT_PATH`: Path to project on server (e.g., /home/username/QuanLyTiecCuoi)

### Database Configuration
- `DB_PASSWORD`: MySQL root password
- `DB_USER`: MySQL user (e.g., qltc_user)
- `DB_DATABASE`: Database name (e.g., qltc_database)
- `DB_USER_PASSWORD`: MySQL user password
- `JWT_SECRET`: JWT secret key for authentication

### Environment Files
- `CLIENT_ENV_PRODUCTION`: Content of client/.env.production
- `SERVER_ENV_PRODUCTION`: Content of server/.env.production

## Current Status ✅

### Files Configured:
- ✅ `.github/workflows/main-production-ci.yml` - GitHub Actions workflow
- ✅ `docker-compose.prod.yml` - Production Docker Compose
- ✅ `client/Dockerfile` - Client Docker image
- ✅ `server/Dockerfile` - Server Docker image
- ✅ `client/nginx.conf` - Nginx configuration
- ✅ Health check endpoints implemented

### IP Configuration:
- ✅ GitHub Actions: `34.70.80.83`
- ✅ Docker Compose: `34.70.80.83`

## Next Steps:

1. **Create VM Instance** in Google Cloud project `prime-works-461005-t7`
2. **Update GitHub Secrets** with Google Cloud SSH private key
3. **Set up project directory** on server
4. **Test deployment** by pushing to main branch

## Deployment Flow:

1. Push to `main` branch
2. GitHub Actions builds Docker images
3. Pushes images to Docker Hub
4. SSH to server and deploy using docker-compose
5. Verify deployment with health checks

## Health Check Endpoints:

- Frontend: `http://34.70.80.83/`
- Backend: `http://34.70.80.83:3001/health`
- API Services: `http://34.70.80.83:3001/api/v1/{service}/health` 