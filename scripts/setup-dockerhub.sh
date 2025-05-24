#!/bin/bash

# QLTC Docker Hub Setup Helper Script
echo "🐳 QLTC Docker Hub Setup Helper"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📍 Step $1: $2${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools exist
check_requirements() {
    print_step "1" "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed. Please install curl first."
        exit 1
    fi
    
    print_success "All requirements met"
}

# Collect Docker Hub information
collect_dockerhub_info() {
    print_step "2" "Collecting Docker Hub information..."
    
    echo ""
    echo "Please provide your Docker Hub details:"
    
    read -p "Docker Hub username: " DOCKER_USERNAME
    
    echo ""
    echo "Docker Hub password (or access token):"
    read -s DOCKER_PASSWORD
    echo ""
    
    if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_PASSWORD" ]; then
        print_error "Docker Hub credentials cannot be empty"
        exit 1
    fi
    
    print_success "Docker Hub credentials collected"
}

# Test Docker Hub login
test_dockerhub_login() {
    print_step "3" "Testing Docker Hub login..."
    
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    
    if [ $? -eq 0 ]; then
        print_success "Docker Hub login successful"
    else
        print_error "Docker Hub login failed. Please check your credentials."
        exit 1
    fi
}

# Check if repositories exist
check_repositories() {
    print_step "4" "Checking repositories..."
    
    print_warning "Please ensure these repositories exist on Docker Hub:"
    echo "  - $DOCKER_USERNAME/qltc-client-prod"
    echo "  - $DOCKER_USERNAME/qltc-server-prod"
    echo ""
    echo "If they don't exist, create them at: https://hub.docker.com/repositories"
    echo ""
    
    read -p "Do repositories exist? (y/n): " REPOS_EXIST
    
    if [[ $REPOS_EXIST != "y" && $REPOS_EXIST != "Y" ]]; then
        print_warning "Please create repositories first, then run this script again."
        echo ""
        echo "Repository creation guide:"
        echo "1. Go to https://hub.docker.com"
        echo "2. Click 'Create Repository'"
        echo "3. Create 'qltc-client-prod' (public or private)"
        echo "4. Create 'qltc-server-prod' (public or private)"
        exit 1
    fi
    
    print_success "Repositories confirmed"
}

# Collect server information
collect_server_info() {
    print_step "5" "Collecting server information..."
    
    echo ""
    echo "Please provide your Bizfly Cloud Server details:"
    
    read -p "Server IP address: " HOST
    read -p "SSH username (default: root): " USERNAME
    USERNAME=${USERNAME:-root}
    read -p "SSH port (default: 22): " PORT
    PORT=${PORT:-22}
    read -p "Project path (default: /opt/qltc): " PROJECT_PATH
    PROJECT_PATH=${PROJECT_PATH:-/opt/qltc}
    
    echo ""
    echo "SSH Private Key (paste the entire private key, then press Enter and Ctrl+D):"
    PRIVATE_KEY=$(cat)
    
    if [ -z "$HOST" ] || [ -z "$PRIVATE_KEY" ]; then
        print_error "Server IP and SSH private key are required"
        exit 1
    fi
    
    print_success "Server information collected"
}

# Generate environment variables
generate_env_vars() {
    print_step "6" "Generating environment variables..."
    
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    DB_USER_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
    
    CLIENT_ENV_PRODUCTION="REACT_APP_API_URL=http://$HOST:3001"
    
    SERVER_ENV_PRODUCTION="NODE_ENV=production
PORT=3001
DB_HOST=mysql
DB_PORT=3306
DB_USER=qltc_user
DB_DATABASE=qltc_database
DB_PASSWORD=$DB_PASSWORD
DB_USER_PASSWORD=$DB_USER_PASSWORD
JWT_SECRET=$JWT_SECRET"
    
    print_success "Environment variables generated"
}

# Output GitHub Secrets
output_github_secrets() {
    print_step "7" "GitHub Secrets Configuration"
    
    echo ""
    echo "==================== GITHUB SECRETS ===================="
    echo ""
    echo "Go to your GitHub repository:"
    echo "Settings → Secrets and Variables → Actions → New repository secret"
    echo ""
    echo "Add these secrets one by one:"
    echo ""
    
    echo "# Docker Hub"
    echo "DOCKER_USERNAME=$DOCKER_USERNAME"
    echo "DOCKER_PASSWORD=$DOCKER_PASSWORD"
    echo ""
    
    echo "# Server SSH"
    echo "HOST=$HOST"
    echo "USERNAME=$USERNAME"
    echo "PORT=$PORT"
    echo "PROJECT_PATH=$PROJECT_PATH"
    echo ""
    
    echo "PRIVATE_KEY="
    echo "$PRIVATE_KEY"
    echo ""
    
    echo "# Environment Files"
    echo "CLIENT_ENV_PRODUCTION=$CLIENT_ENV_PRODUCTION"
    echo ""
    echo "SERVER_ENV_PRODUCTION=$SERVER_ENV_PRODUCTION"
    echo ""
    
    echo "# Database"
    echo "DB_PASSWORD=$DB_PASSWORD"
    echo "DB_USER=qltc_user"
    echo "DB_DATABASE=qltc_database"
    echo "DB_USER_PASSWORD=$DB_USER_PASSWORD"
    echo "JWT_SECRET=$JWT_SECRET"
    echo ""
    echo "========================================================"
}

# Save configuration to file
save_configuration() {
    print_step "8" "Saving configuration..."
    
    CONFIG_FILE=".dockerhub-config"
    
    cat > "$CONFIG_FILE" << EOF
# QLTC Docker Hub Configuration
# Generated on $(date)

DOCKER_USERNAME=$DOCKER_USERNAME
HOST=$HOST
USERNAME=$USERNAME
PORT=$PORT
PROJECT_PATH=$PROJECT_PATH

# Database credentials (save these securely!)
DB_PASSWORD=$DB_PASSWORD
DB_USER_PASSWORD=$DB_USER_PASSWORD
JWT_SECRET=$JWT_SECRET
EOF
    
    print_success "Configuration saved to $CONFIG_FILE"
    print_warning "Keep this file secure and don't commit it to git!"
}

# Main execution
main() {
    echo ""
    echo "This script will help you setup Docker Hub deployment for QLTC"
    echo "You'll need:"
    echo "- Docker Hub account"
    echo "- Bizfly Cloud Server"
    echo "- SSH access to the server"
    echo ""
    
    read -p "Ready to continue? (y/n): " CONTINUE
    
    if [[ $CONTINUE != "y" && $CONTINUE != "Y" ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    echo ""
    
    check_requirements
    collect_dockerhub_info
    test_dockerhub_login
    check_repositories
    collect_server_info
    generate_env_vars
    output_github_secrets
    save_configuration
    
    echo ""
    print_success "Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Add all the GitHub Secrets shown above"
    echo "2. Setup your Bizfly Cloud Server:"
    echo "   ssh $USERNAME@$HOST"
    echo "   curl -o setup.sh https://raw.githubusercontent.com/your-username/QuanLyTiecCuoi/main/scripts/setup-production-server.sh"
    echo "   chmod +x setup.sh && ./setup.sh"
    echo ""
    echo "3. Push code to trigger deployment:"
    echo "   git add ."
    echo "   git commit -m 'Deploy to Docker Hub'"
    echo "   git push origin main"
    echo ""
    echo "🎉 Happy deploying!"
}

# Run main function
main 