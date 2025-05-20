#!/bin/bash

# Script to pull and run QLTC application from Docker Hub
set -e

# Configuration
if [ -f .env ]; then
  echo "Loading environment from .env file"
  source .env
else
  echo "Creating .env file"
  read -p "Enter your Docker Hub username: " DOCKER_USERNAME
  echo "DOCKER_USERNAME=$DOCKER_USERNAME" > .env
  echo "IMAGE_TAG=latest" >> .env
fi

source .env

echo "Starting QLTC Application with images from $DOCKER_USERNAME"

# Pull the latest images
echo "Pulling latest images..."
docker-compose pull

# Start the containers
echo "Starting containers..."
docker-compose up -d

# Show container status
echo "Container status:"
docker-compose ps

echo "Application started!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:3001"
echo ""
echo "To stop the application, run: docker-compose down" 