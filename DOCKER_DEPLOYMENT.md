# Docker Deployment Guide

This guide will help you containerize and deploy the Car Rental System using Docker.

## Prerequisites

- Docker installed on your system ([Download Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Build and run the application:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api/cars

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker CLI

1. **Build the Docker image:**
   ```bash
   docker build -t car-rental-system .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 5000:5000 --name car-rental-app car-rental-system
   ```

3. **Access the application:**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api/cars

4. **View logs:**
   ```bash
   docker logs -f car-rental-app
   ```

5. **Stop the container:**
   ```bash
   docker stop car-rental-app
   docker rm car-rental-app
   ```

## Data Persistence

The application uses a Docker volume to persist data (users, bookings, cars). This ensures your data survives container restarts.

- Volume name: `car-rental-data`
- Mounted at: `/app/Backend/data`

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## Deployment to Cloud Platforms

### Deploy to Docker Hub

1. **Tag your image:**
   ```bash
   docker tag car-rental-system yourusername/car-rental-system:latest
   ```

2. **Login to Docker Hub:**
   ```bash
   docker login
   ```

3. **Push the image:**
   ```bash
   docker push yourusername/car-rental-system:latest
   ```

### Deploy to AWS ECS

1. **Install AWS CLI and configure credentials**

2. **Create ECR repository:**
   ```bash
   aws ecr create-repository --repository-name car-rental-system
   ```

3. **Authenticate Docker to ECR:**
   ```bash
   aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
   ```

4. **Tag and push image:**
   ```bash
   docker tag car-rental-system:latest your-account-id.dkr.ecr.your-region.amazonaws.com/car-rental-system:latest
   docker push your-account-id.dkr.ecr.your-region.amazonaws.com/car-rental-system:latest
   ```

5. **Create ECS task definition and service** (use AWS Console or CLI)

### Deploy to Google Cloud Run

1. **Enable Cloud Run API and authenticate:**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Build and deploy:**
   ```bash
   gcloud run deploy car-rental-system \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 5000
   ```

### Deploy to Azure Container Instances

1. **Login to Azure:**
   ```bash
   az login
   ```

2. **Create resource group:**
   ```bash
   az group create --name car-rental-rg --location eastus
   ```

3. **Create container registry:**
   ```bash
   az acr create --resource-group car-rental-rg --name carrentalacr --sku Basic
   ```

4. **Build and push image:**
   ```bash
   az acr build --registry carrentalacr --image car-rental-system:latest .
   ```

5. **Deploy container:**
   ```bash
   az container create \
     --resource-group car-rental-rg \
     --name car-rental-app \
     --image carrentalacr.azurecr.io/car-rental-system:latest \
     --dns-name-label car-rental-unique \
     --ports 5000
   ```

### Deploy to Heroku with Docker

1. **Login to Heroku:**
   ```bash
   heroku login
   heroku container:login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-car-rental-app
   ```

3. **Build and push container:**
   ```bash
   heroku container:push web --app your-car-rental-app
   ```

4. **Release the container:**
   ```bash
   heroku container:release web --app your-car-rental-app
   ```

5. **Open the app:**
   ```bash
   heroku open --app your-car-rental-app
   ```

### Deploy to DigitalOcean App Platform

1. **Push your code to GitHub**

2. **Connect to DigitalOcean App Platform:**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Select your GitHub repository
   - Choose "Dockerfile" as build method
   - Set port to 5000
   - Deploy

### Deploy to Railway

1. **Push your code to GitHub**

2. **Deploy on Railway:**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the Dockerfile
   - Set environment variable: `PORT=5000`
   - Deploy

## Environment Variables

You can customize the application using environment variables:

- `PORT`: Port to run the application (default: 5000)
- `FLASK_ENV`: Flask environment (production/development)

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs` or `docker logs car-rental-app`
- Verify port 5000 is not in use

### Data not persisting
- Ensure volume is created: `docker volume ls`
- Check volume mount in container: `docker inspect car-rental-app`

### Cannot access application
- Verify container is running: `docker ps`
- Check port mapping: should show `0.0.0.0:5000->5000/tcp`
- Try accessing: http://localhost:5000

## Maintenance Commands

### View running containers
```bash
docker ps
```

### View all containers
```bash
docker ps -a
```

### Remove stopped containers
```bash
docker container prune
```

### View images
```bash
docker images
```

### Remove unused images
```bash
docker image prune
```

### Backup data volume
```bash
docker run --rm -v car-rental-data:/data -v $(pwd):/backup ubuntu tar czf /backup/car-rental-backup.tar.gz /data
```

### Restore data volume
```bash
docker run --rm -v car-rental-data:/data -v $(pwd):/backup ubuntu tar xzf /backup/car-rental-backup.tar.gz -C /
```

## Production Recommendations

1. **Use environment variables for secrets** (don't hardcode in Dockerfile)
2. **Set up health checks** (included in docker-compose.yml)
3. **Use a reverse proxy** (nginx) for production
4. **Enable HTTPS/SSL** with Let's Encrypt
5. **Set up monitoring** and logging
6. **Configure backups** for the data volume
7. **Use Docker secrets** for sensitive data
8. **Implement rate limiting** and security measures

## Support

For issues or questions, check the logs and ensure all prerequisites are installed correctly.
