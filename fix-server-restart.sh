#!/bin/bash

echo "🔧 QLTC Server Restart Fix"
echo "=========================="

# Navigate to project directory
cd /opt/qltc/QuanLyTiecCuoi

echo "1. Checking current status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "2. Checking .env file..."
if [ ! -f ".env" ]; then
    echo "❌ .env file missing! Creating it..."
    cat > .env << 'EOF'
DOCKER_USERNAME=hoang636
IMAGE_TAG=latest
DB_PASSWORD=cpmFV0MxELG9ehwlrpeY0YFxl
DB_USER=qltc_user
DB_DATABASE=qltc_database
DB_USER_PASSWORD=qHRd0UPeaYkDYRCUScFUKAsvF
JWT_SECRET=IavS3GI3pUEByVDbPEWRYwitEnkWYXH42qbZNEOK3ptgrdJHnqHqnH3MaIJ8ZxHnsmcvjg
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file exists"
fi

echo ""
echo "3. Checking server logs for errors..."
docker-compose -f docker-compose.prod.yml logs --tail 10 qltc-server

echo ""
echo "4. Stopping all containers..."
docker-compose -f docker-compose.prod.yml down

echo ""
echo "5. Removing any orphaned containers..."
docker container prune -f

echo ""
echo "6. Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

echo ""
echo "7. Starting containers with fresh state..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "8. Waiting for containers to stabilize..."
sleep 15

echo ""
echo "9. Final status check..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "10. Health checks..."
echo "Client health:"
curl -f http://localhost:80 && echo "✅ Client OK" || echo "❌ Client failed"

echo "Server health:"
curl -f http://localhost:3001/health && echo "✅ Server OK" || echo "❌ Server failed"

echo ""
echo "🎯 If server is still restarting, check logs:"
echo "   docker-compose -f docker-compose.prod.yml logs qltc-server"
echo ""
echo "🔗 Access URLs:"
echo "   Frontend: http://103.153.72.156"
echo "   API: http://103.153.72.156:3001/health"
echo "   API Docs: http://103.153.72.156:3001/api-docs" 