#!/bin/bash

# Script to run QLTC development environment
set -e

# Configuration
if [ -f .env.dev ]; then
  echo "Loading environment from .env.dev file"
  source .env.dev
else
  echo "Creating .env.dev file"
  read -p "Enter your Docker Hub username: " DOCKER_USERNAME
  echo "DOCKER_USERNAME=$DOCKER_USERNAME" > .env.dev
  echo "IMAGE_TAG=latest" >> .env.dev
fi

export DOCKER_USERNAME=$(grep DOCKER_USERNAME .env.dev | cut -d '=' -f2)
export IMAGE_TAG=$(grep IMAGE_TAG .env.dev | cut -d '=' -f2)

echo "Starting QLTC Development Environment with images from $DOCKER_USERNAME"

# Check if client/.env.development exists
if [ ! -f client/.env.development ]; then
  echo "Creating client/.env.development from example file..."
  cp client-env-development.example client/.env.development
  echo "Please update client/.env.development with your specific configurations."
fi

# Check if server/.env.development exists
if [ ! -f server/.env.development ]; then
  echo "Creating server/.env.development from example file..."
  cp server-env-development.example server/.env.development
  echo "Please update server/.env.development with your specific configurations."
fi

# Pull the latest development images
echo "Pulling latest development images..."
docker-compose pull

# Start the development containers
echo "Starting development containers..."
docker-compose up -d

# Show container status
echo "Container status:"
docker-compose ps

echo "Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo ""
echo "To stop the application, run: docker-compose down" 