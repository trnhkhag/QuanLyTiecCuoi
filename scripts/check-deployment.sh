#!/bin/bash

# QLTC Deployment Status Checker
echo "🔍 QLTC Deployment Status Checker"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper functions
print_header() {
    echo -e "\n${BLUE}$1${NC}"
    echo "$(printf '=%.0s' {1..50})"
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

# Get server info
get_server_info() {
    if [ -f ".dockerhub-config" ]; then
        source .dockerhub-config
        print_success "Loaded configuration from .dockerhub-config"
    else
        echo "Please provide server information:"
        read -p "Server IP: " HOST
        read -p "SSH username (default: root): " USERNAME
        USERNAME=${USERNAME:-root}
        read -p "SSH port (default: 22): " PORT
        PORT=${PORT:-22}
        read -p "Project path (default: /opt/qltc): " PROJECT_PATH
        PROJECT_PATH=${PROJECT_PATH:-/opt/qltc}
    fi
}

# Check GitHub Actions
check_github_actions() {
    print_header "📊 GitHub Actions Status"
    
    if command -v gh &> /dev/null; then
        echo "Recent workflow runs:"
        gh run list --limit 5 2>/dev/null || print_warning "Cannot fetch GitHub Actions status (gh CLI not authenticated)"
    else
        print_warning "GitHub CLI not installed. Check manually: https://github.com/your-username/QuanLyTiecCuoi/actions"
    fi
}

# Check Docker Hub images
check_dockerhub_images() {
    print_header "🐳 Docker Hub Images"
    
    if [ -n "$DOCKER_USERNAME" ]; then
        echo "Checking images for user: $DOCKER_USERNAME"
        
        # Try to check if images exist (requires docker login)
        if docker manifest inspect "$DOCKER_USERNAME/qltc-client:latest" &>/dev/null; then
            print_success "qltc-client:latest exists"
        else
            print_error "qltc-client:latest not found or not accessible"
        fi
        
        if docker manifest inspect "$DOCKER_USERNAME/qltc-server:latest" &>/dev/null; then
            print_success "qltc-server:latest exists"
        else
            print_error "qltc-server:latest not found or not accessible"
        fi
    else
        print_warning "Docker username not found. Check manually at: https://hub.docker.com"
    fi
}

# Check server connectivity
check_server_connectivity() {
    print_header "🌐 Server Connectivity"
    
    echo "Testing connection to $HOST:$PORT..."
    
    if timeout 10 bash -c "</dev/tcp/$HOST/$PORT"; then
        print_success "Server is reachable on port $PORT"
    else
        print_error "Cannot connect to server on port $PORT"
        return 1
    fi
}

# Check deployment on server
check_server_deployment() {
    print_header "🖥️ Server Deployment Status"
    
    echo "Connecting to server..."
    
    # Create a temporary script to run on server
    ssh_script="
    echo '=== Docker Status ==='
    docker --version 2>/dev/null || echo 'Docker not installed'
    
    echo -e '\n=== Docker Compose Status ==='
    docker-compose --version 2>/dev/null || echo 'Docker Compose not installed'
    
    echo -e '\n=== Project Directory ==='
    if [ -d '$PROJECT_PATH' ]; then
        echo 'Project directory exists: $PROJECT_PATH'
        cd $PROJECT_PATH
        ls -la
    else
        echo 'Project directory not found: $PROJECT_PATH'
        exit 1
    fi
    
    echo -e '\n=== Running Containers ==='
    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
    
    echo -e '\n=== QLTC Containers ==='
    if docker-compose -f docker-compose.prod.dockerhub.yml ps 2>/dev/null; then
        echo 'QLTC containers found'
    else
        echo 'QLTC containers not running or compose file not found'
    fi
    
    echo -e '\n=== Container Logs (last 10 lines) ==='
    docker-compose -f docker-compose.prod.dockerhub.yml logs --tail=10 2>/dev/null || echo 'Cannot fetch logs'
    
    echo -e '\n=== System Resources ==='
    df -h / 2>/dev/null | grep -v Filesystem || echo 'Cannot check disk space'
    free -h 2>/dev/null | grep -E 'Mem:|Swap:' || echo 'Cannot check memory'
    "
    
    # Execute on server
    if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -p "$PORT" "$USERNAME@$HOST" "$ssh_script" 2>/dev/null; then
        print_success "Server deployment check completed"
    else
        print_error "Cannot execute commands on server. Check SSH access."
        return 1
    fi
}

# Check website accessibility
check_website() {
    print_header "🌐 Website Accessibility"
    
    echo "Testing frontend (port 80)..."
    if timeout 10 curl -s "http://$HOST" >/dev/null; then
        print_success "Frontend is accessible at http://$HOST"
    else
        print_error "Frontend is not accessible at http://$HOST"
    fi
    
    echo "Testing backend API (port 3001)..."
    if timeout 10 curl -s "http://$HOST:3001/health" >/dev/null; then
        print_success "Backend API is accessible at http://$HOST:3001"
    else
        print_error "Backend API is not accessible at http://$HOST:3001/health"
    fi
    
    echo "Testing backend base endpoint..."
    backend_response=$(timeout 10 curl -s "http://$HOST:3001" 2>/dev/null)
    if [ -n "$backend_response" ]; then
        print_success "Backend responds: $backend_response"
    else
        print_warning "Backend not responding on port 3001"
    fi
}

# Generate health report
generate_report() {
    print_header "📋 Health Report Summary"
    
    echo "Deployment Health Check completed at $(date)"
    echo ""
    echo "Server: $HOST:$PORT"
    echo "Project Path: $PROJECT_PATH"
    echo ""
    
    # Quick status check
    if timeout 5 curl -s "http://$HOST" >/dev/null; then
        print_success "OVERALL STATUS: HEALTHY ✅"
        echo ""
        echo "✅ Frontend: http://$HOST"
        echo "✅ Backend: http://$HOST:3001"
    else
        print_error "OVERALL STATUS: UNHEALTHY ❌"
        echo ""
        echo "❌ Check server logs and container status"
        echo "❌ Verify firewall settings"
    fi
    
    echo ""
    echo "Troubleshooting commands:"
    echo "ssh $USERNAME@$HOST -p $PORT"
    echo "cd $PROJECT_PATH && docker-compose -f docker-compose.prod.dockerhub.yml logs"
    echo "cd $PROJECT_PATH && docker-compose -f docker-compose.prod.dockerhub.yml ps"
}

# Main execution
main() {
    echo ""
    echo "This script will check your QLTC deployment status"
    echo ""
    
    get_server_info
    
    echo ""
    check_github_actions
    check_dockerhub_images
    
    if check_server_connectivity; then
        check_server_deployment
        check_website
    else
        print_error "Cannot connect to server. Skipping server checks."
    fi
    
    generate_report
    
    echo ""
    echo "Check completed! 🎉"
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 