#!/bin/bash

# Script to help generate GitHub Secrets for QLTC deployment

echo "🔐 QLTC GitHub Secrets Generator"
echo "================================="
echo ""

# Read user inputs
echo "📝 Nhập thông tin Bizfly Container Registry:"
read -p "BIZFLY_USERNAME (username Bizfly): " BIZFLY_USERNAME
read -s -p "BIZFLY_PASSWORD (password Bizfly): " BIZFLY_PASSWORD
echo ""
read -p "BIZFLY_UNIQUE_ID (unique ID từ registry URI): " BIZFLY_UNIQUE_ID
echo ""

echo "📝 Nhập thông tin Cloud Server:"
read -p "HOST (IP address server): " HOST
read -p "USERNAME (SSH username, thường là 'root'): " USERNAME
read -p "PORT (SSH port, thường là 22): " PORT
read -p "PROJECT_PATH (đường dẫn project, thường là '/opt/qltc'): " PROJECT_PATH
echo ""

echo "📝 Nhập thông tin Database & Application:"
read -s -p "DB_PASSWORD (mật khẩu database): " DB_PASSWORD
echo ""
read -p "DB_USER (database user, thường là 'root'): " DB_USER
read -p "DB_DATABASE (tên database, thường là 'TiecCuoiDB'): " DB_DATABASE
read -s -p "DB_USER_PASSWORD (mật khẩu DB user): " DB_USER_PASSWORD
echo ""
read -s -p "JWT_SECRET (JWT secret key): " JWT_SECRET
echo ""
echo ""

# Generate secrets
echo "🔑 GitHub Secrets để paste vào GitHub:"
echo "====================================="
echo ""

echo "BIZFLY_USERNAME"
echo "$BIZFLY_USERNAME"
echo ""

echo "BIZFLY_PASSWORD"
echo "$BIZFLY_PASSWORD"
echo ""

echo "BIZFLY_UNIQUE_ID"
echo "$BIZFLY_UNIQUE_ID"
echo ""

echo "HOST"
echo "$HOST"
echo ""

echo "USERNAME"
echo "$USERNAME"
echo ""

echo "PORT"
echo "$PORT"
echo ""

echo "PROJECT_PATH"
echo "$PROJECT_PATH"
echo ""

echo "CLIENT_ENV_PRODUCTION"
echo "REACT_APP_API_URL=http://$HOST:3001/api"
echo "REACT_APP_ENV=production"
echo ""

echo "SERVER_ENV_PRODUCTION"
echo "NODE_ENV=production"
echo "PORT=3001"
echo "JWT_SECRET=$JWT_SECRET"
echo "DB_HOST=mysql"
echo "DB_PORT=3306"
echo ""

echo "DB_PASSWORD"
echo "$DB_PASSWORD"
echo ""

echo "DB_USER"
echo "$DB_USER"
echo ""

echo "DB_DATABASE"
echo "$DB_DATABASE"
echo ""

echo "DB_USER_PASSWORD"
echo "$DB_USER_PASSWORD"
echo ""

echo "JWT_SECRET"
echo "$JWT_SECRET"
echo ""

echo "PRIVATE_KEY"
echo "👆 Paste nội dung file ~/.ssh/qltc_deploy (private key)"
echo ""

# Generate .env.production file
echo "📄 Nội dung file .env.production cho server:"
echo "============================================"

cat > .env.production.example << EOF
BIZFLY_REGISTRY=cr-hn-1.bizflycloud.vn
BIZFLY_UNIQUE_ID=$BIZFLY_UNIQUE_ID
IMAGE_TAG=latest
DB_PASSWORD=$DB_PASSWORD
DB_USER=$DB_USER
DB_DATABASE=$DB_DATABASE
DB_USER_PASSWORD=$DB_USER_PASSWORD
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
EOF

echo "File .env.production.example đã được tạo!"
echo ""

echo "✅ Hoàn thành! Copy các secrets trên vào GitHub repository."
echo "📝 Hướng dẫn chi tiết: Xem file STEP_BY_STEP_GUIDE.md" 