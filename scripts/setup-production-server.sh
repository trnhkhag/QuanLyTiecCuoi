#!/bin/bash

# Setup Production Server for QLTC Project
# This script should be run on your cloud server

set -e

echo "=== Starting Production Server Setup ==="

# Update system
echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed"
fi

# Install Git
echo "Installing Git..."
sudo apt-get install -y git

# Install additional tools
echo "Installing additional tools..."
sudo apt-get install -y curl wget htop nano ufw

# Setup firewall
echo "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3001/tcp
sudo ufw --force enable

# Create project directory
PROJECT_DIR="/opt/qltc"
echo "Creating project directory: $PROJECT_DIR"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Clone repository (you'll need to provide the repository URL)
echo "Note: You need to clone your repository manually:"
echo "git clone <your-repo-url> $PROJECT_DIR"
echo "cd $PROJECT_DIR"

# Setup system service for auto-start
echo "Creating systemd service..."
sudo tee /etc/systemd/system/qltc.service > /dev/null <<EOF
[Unit]
Description=QLTC Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
User=$USER
Group=$USER

[Install]
WantedBy=multi-user.target
EOF

# Enable service
sudo systemctl daemon-reload
sudo systemctl enable qltc.service

# Setup log rotation
echo "Setting up log rotation..."
sudo tee /etc/logrotate.d/qltc > /dev/null <<EOF
/opt/qltc/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

# Create logs directory
mkdir -p $PROJECT_DIR/logs

# Setup monitoring script
echo "Creating monitoring script..."
tee $PROJECT_DIR/monitor.sh > /dev/null <<'EOF'
#!/bin/bash

# Simple monitoring script for QLTC services
check_service() {
    local service_name=$1
    local url=$2
    
    if curl -f -s $url > /dev/null; then
        echo "✅ $service_name is healthy"
        return 0
    else
        echo "❌ $service_name is down"
        return 1
    fi
}

echo "=== QLTC Service Health Check ==="
echo "Timestamp: $(date)"

# Check if containers are running
echo "--- Container Status ---"
docker-compose -f docker-compose.prod.yml ps

echo "--- Service Health Checks ---"
check_service "Frontend" "http://localhost:80"
check_service "Backend" "http://localhost:3001/api/health"

echo "--- System Resources ---"
echo "Memory usage:"
free -h
echo "Disk usage:"
df -h
echo "Docker disk usage:"
docker system df

echo "========================"
EOF

chmod +x $PROJECT_DIR/monitor.sh

# Setup cron for monitoring
echo "Setting up monitoring cron job..."
(crontab -l 2>/dev/null; echo "*/5 * * * * $PROJECT_DIR/monitor.sh >> $PROJECT_DIR/logs/monitor.log 2>&1") | crontab -

# Create backup script
echo "Creating backup script..."
tee $PROJECT_DIR/backup.sh > /dev/null <<'EOF'
#!/bin/bash

# Backup script for QLTC database
BACKUP_DIR="/opt/qltc/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="qltc_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

echo "Creating database backup: $BACKUP_FILE"
docker exec $(docker-compose -f docker-compose.prod.yml ps -q mysql) \
    mysqldump -u root -pAdmin12345 TiecCuoiDB > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE.gz"
EOF

chmod +x $PROJECT_DIR/backup.sh

# Setup daily backup cron
echo "Setting up daily backup..."
(crontab -l 2>/dev/null; echo "0 2 * * * $PROJECT_DIR/backup.sh >> $PROJECT_DIR/logs/backup.log 2>&1") | crontab -

echo "=== Production Server Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Clone your repository to $PROJECT_DIR"
echo "2. Configure your .env.production file"
echo "3. Setup GitHub Secrets for deployment"
echo "4. Start the application with: sudo systemctl start qltc"
echo ""
echo "Useful commands:"
echo "- Monitor services: $PROJECT_DIR/monitor.sh"
echo "- View logs: docker-compose -f docker-compose.prod.yml logs"
echo "- Backup database: $PROJECT_DIR/backup.sh"
echo "- Start/Stop: sudo systemctl start/stop qltc" 