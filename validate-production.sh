#!/bin/bash

echo "🔍 Validating Production Configuration..."
echo "========================================"

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file missing"
    exit 1
fi

# Check docker-compose.prod.yml syntax
echo ""
echo "📄 Checking docker-compose.prod.yml syntax..."
if docker-compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.prod.yml syntax is valid"
else
    echo "❌ docker-compose.prod.yml has syntax errors"
    echo "Running docker-compose config for details:"
    docker-compose -f docker-compose.prod.yml config
    exit 1
fi

# Check required environment variables
echo ""
echo "🔧 Checking environment variables..."
required_vars=("DOCKER_USERNAME" "IMAGE_TAG" "DB_PASSWORD" "DB_USER" "DB_DATABASE" "DB_USER_PASSWORD" "JWT_SECRET")

source .env

for var in "${required_vars[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var is set"
    else
        echo "❌ $var is not set"
    fi
done

# Check Database init directory
echo ""
echo "📁 Checking Database init directory..."
if [ -d "Database/init" ]; then
    echo "✅ Database/init directory exists"
    echo "   Found files:"
    ls -la Database/init/ | grep -v "^total"
else
    echo "❌ Database/init directory missing"
    echo "   Creating directory..."
    mkdir -p Database/init
    echo "✅ Database/init directory created"
fi

echo ""
echo "🎯 Production validation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: docker-compose -f docker-compose.prod.yml up -d"
echo "2. Check health: docker-compose -f docker-compose.prod.yml ps"
echo "3. View logs: docker-compose -f docker-compose.prod.yml logs -f" 