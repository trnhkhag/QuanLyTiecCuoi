#!/bin/bash

# Generate SERVER_ENV_PRODUCTION from .dockerhub-config
if [ ! -f ".dockerhub-config" ]; then
    echo "❌ File .dockerhub-config not found!"
    echo "Please run: bash scripts/setup-dockerhub.sh first"
    exit 1
fi

# Load configuration
source .dockerhub-config

echo "🔧 Generating SERVER_ENV_PRODUCTION..."
echo ""

# Create SERVER_ENV_PRODUCTION
SERVER_ENV_PRODUCTION="NODE_ENV=production
PORT=3001
DB_HOST=mysql
DB_PORT=3306
DB_USER=qltc_user
DB_DATABASE=qltc_database
DB_PASSWORD=$DB_PASSWORD
DB_USER_PASSWORD=$DB_USER_PASSWORD
JWT_SECRET=$JWT_SECRET"

echo "==================== SERVER_ENV_PRODUCTION ===================="
echo "Copy this value to GitHub Secrets:"
echo ""
echo "Name: SERVER_ENV_PRODUCTION"
echo "Value:"
echo "$SERVER_ENV_PRODUCTION"
echo ""
echo "================================================================="
echo ""

echo "📋 Complete GitHub Secrets List:"
echo ""
echo "DOCKER_USERNAME=$DOCKER_USERNAME"
echo "DOCKER_PASSWORD=<your-docker-password>"
echo ""
echo "HOST=$HOST"
echo "USERNAME=$USERNAME"
echo "PORT=$PORT"
echo "PROJECT_PATH=$PROJECT_PATH"
echo "PRIVATE_KEY=<your-ssh-private-key>"
echo ""
echo "CLIENT_ENV_PRODUCTION=REACT_APP_API_URL=http://$HOST:3001"
echo ""
echo "SERVER_ENV_PRODUCTION=$SERVER_ENV_PRODUCTION"
echo ""
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_USER=qltc_user"
echo "DB_DATABASE=qltc_database"
echo "DB_USER_PASSWORD=$DB_USER_PASSWORD"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "✅ Ready to add to GitHub Secrets!" 