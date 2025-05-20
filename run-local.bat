@echo off
echo QLTC Docker Application Runner

rem Check if .env file exists
if exist .env (
  echo Loading environment from .env file
) else (
  echo Creating .env file
  set /p DOCKER_USERNAME="Enter your Docker Hub username: "
  echo DOCKER_USERNAME=%DOCKER_USERNAME%> .env
  echo IMAGE_TAG=latest>> .env
)

echo Starting QLTC Application

rem Pull the latest images
echo Pulling latest images...
docker-compose pull

rem Start the containers
echo Starting containers...
docker-compose up -d

rem Show container status
echo Container status:
docker-compose ps

echo.
echo Application started!
echo Frontend: http://localhost
echo Backend API: http://localhost:3001
echo.
echo To stop the application, run: docker-compose down

pause 