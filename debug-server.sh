#!/bin/bash

echo "🔍 QLTC Server Debug Script"
echo "=========================="

echo "1. Container Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "2. Server Logs (last 20 lines):"
docker-compose -f docker-compose.prod.yml logs --tail 20 qltc-server

echo ""
echo "3. Environment Variables:"
docker-compose -f docker-compose.prod.yml exec qltc-server env | grep -E "(NODE_ENV|DB_|JWT_|PORT)" || echo "Container not running"

echo ""
echo "4. Network connectivity test:"
docker-compose -f docker-compose.prod.yml exec qltc-server ping -c 2 mysql || echo "Cannot reach MySQL"

echo ""
echo "5. MySQL Status:"
docker-compose -f docker-compose.prod.yml logs --tail 10 mysql

echo ""
echo "6. .env file check:"
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    cat .env
else
    echo "❌ .env file missing!"
fi

echo ""
echo "7. Manual restart attempt:"
echo "Stopping containers..."
docker-compose -f docker-compose.prod.yml down

echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "8. Final status:"
sleep 10
docker-compose -f docker-compose.prod.yml ps 