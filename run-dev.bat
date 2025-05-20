@echo off
echo QLTC Development Environment Runner

rem Check if .env.dev file exists
if exist .env.dev (
  echo Loading environment from .env.dev file
) else (
  echo Creating .env.dev file
  set /p DOCKER_USERNAME="Enter your Docker Hub username: "
  echo DOCKER_USERNAME=%DOCKER_USERNAME%> .env.dev
  echo IMAGE_TAG=latest>> .env.dev
)

echo Starting QLTC Development Environment

rem Check if client/.env.development exists
if not exist client\.env.development (
  echo Creating client/.env.development from example file...
  copy client-env-development.example client\.env.development
  echo Please update client/.env.development with your specific configurations.
)

rem Check if server/.env.development exists
if not exist server\.env.development (
  echo Creating server/.env.development from example file...
  copy server-env-development.example server\.env.development
  echo Please update server/.env.development with your specific configurations.
)

rem Pull the latest development images
echo Pulling latest development images...
docker-compose pull

rem Start the development containers
echo Starting development containers...
docker-compose up -d

rem Show container status
echo Container status:
docker-compose ps

echo.
echo Development environment started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3001
echo.
echo To stop the application, run: docker-compose down

pause 