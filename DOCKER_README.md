# Docker Setup for Quản Lý Tiệc Cưới (QLTC)

This repository contains Docker setup for the QLTC wedding management application, allowing for containerized deployment and CI/CD automation.

## Architecture

The application consists of two main services:

1. **Client** (Frontend): A React application
2. **Server** (Backend): A Node.js API server

## Development Environment

### Prerequisites

- Docker and Docker Compose installed
- Git

### Running Development Environment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd QuanLyTiecCuoi
   ```

2. Create environment files:
   - Copy `client-env-development.example` to `client/.env.development`
   - Copy `server-env-development.example` to `server/.env.development`
   - Modify both files as needed for your environment

3. Start the development services:
   ```bash
   # For Linux/Mac
   ./run-dev.sh
   
   # For Windows
   run-dev.bat
   ```

4. Access the development application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

5. Code changes will automatically reload in both frontend and backend.

6. To stop the services:
   ```bash
   docker-compose down
   ```

## Production Environment

### Running Production Environment

1. Create a `.env` file with your Docker Hub username:
   ```
   DOCKER_USERNAME=your-username
   ```

2. Start the services:
   ```bash
   # For Linux/Mac
   ./run-local.sh
   
   # For Windows
   run-local.bat
   ```

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

## CI/CD with GitHub Actions

The repository includes GitHub Actions workflows for both development and production environments.

### Setup

1. In your GitHub repository, add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token
   - `CLIENT_ENV_DEVELOPMENT`: The full contents of your client/.env.development file
   - `SERVER_ENV_DEVELOPMENT`: The full contents of your server/.env.development file

2. The workflows will build and push images to Docker Hub:
   - `docker-dev-ci.yml`: Builds development images from `develop` branch
   - `docker-ci.yml`: Builds production images from `main/master` branch

3. After the workflows complete, you can pull the images from Docker Hub:
   ```bash
   # Development images
   docker pull <your-username>/qltc-client-dev:latest
   docker pull <your-username>/qltc-server-dev:latest
   
   # Production images
   docker pull <your-username>/qltc-client:latest
   docker pull <your-username>/qltc-server:latest
   ```

## Configuration

### Environment Files

#### Development
- `client/.env.development`: Frontend development environment variables
- `server/.env.development`: Backend development environment variables

#### Production
- Client uses environment variables from the container
- Server uses environment variables from the container

## Troubleshooting

- **Container won't start**: Check logs with `docker-compose logs`
- **Client can't reach server**: Ensure the network is properly configured
- **Hot reload not working**: Make sure volumes are mounted correctly
- **Database connection issues**: Verify database credentials in environment variables

## Production Deployment

For production deployment, consider:

1. Using proper SSL certificates
2. Configuring proper environment variables
3. Setting up database persistence
4. Implementing proper authentication for Docker Hub

```bash
# Example production startup
export DOCKER_USERNAME=your-username
export IMAGE_TAG=specific-version
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
``` 