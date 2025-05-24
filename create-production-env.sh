#!/bin/bash

# Script to create production .env file for main branch
echo "Creating production .env file for main branch..."

cat > .env << 'EOF'
# Production Environment Variables
DOCKER_USERNAME=hoang636
IMAGE_TAG=latest

# Database Configuration  
DB_PASSWORD=cpmFV0MxELG9ehwlrpeY0YFxl
DB_USER=qltc_user
DB_DATABASE=qltc_database
DB_USER_PASSWORD=qHRd0UPeaYkDYRCUScFUKAsvF

# Security
JWT_SECRET=IavS3GI3pUEByVDbPEWRYwitEnkWYXH42qbZNEOK3ptgrdJHnqHqnH3MaIJ8ZxHnsmcvjg

# API Configuration
API_URL=http://103.153.72.156:3001
EOF

echo "✅ Production .env file created successfully!"
echo "📄 File location: $(pwd)/.env"

# Display file contents (without JWT_SECRET for security)
echo ""
echo "📋 Environment variables configured:"
echo "DOCKER_USERNAME=hoang636"
echo "IMAGE_TAG=latest"
echo "DB_USER=qltc_user"
echo "DB_DATABASE=qltc_database"
echo "JWT_SECRET=****(hidden)****"
echo "API_URL=http://103.153.72.156:3001" 