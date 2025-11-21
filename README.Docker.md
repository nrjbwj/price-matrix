# Docker Setup for Price Matrix

This document explains how to build and run the Price Matrix application using Docker.

## Prerequisites

- Docker (version 20.10 or later)
- Docker Compose (version 2.0 or later, optional)

## Building the Docker Image

### Using Docker directly:

```bash
docker build -t price-matrix:latest .
```

### Using Docker Compose:

```bash
docker-compose build
```

## Running the Container

### Using Docker directly:

```bash
docker run -p 3000:3000 price-matrix:latest
```

### Using Docker Compose:

```bash
docker-compose up
```

To run in detached mode:

```bash
docker-compose up -d
```

## Accessing the Application

Once the container is running, access the application at:

```
http://localhost:3000
```

## Stopping the Container

### Using Docker directly:

```bash
docker stop <container-id>
```

### Using Docker Compose:

```bash
docker-compose down
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Set any required environment variables in `docker-compose.yml` or use a `.env` file
2. **Reverse Proxy**: Use nginx or another reverse proxy in front of the container
3. **SSL/TLS**: Configure SSL certificates for HTTPS
4. **Resource Limits**: Set appropriate CPU and memory limits in `docker-compose.yml`
5. **Health Checks**: The health check is already configured in `docker-compose.yml`

## Image Optimization

The Dockerfile uses a multi-stage build to:
- Minimize the final image size
- Separate build dependencies from runtime dependencies
- Use Alpine Linux for a smaller base image
- Run as a non-root user for security

## Troubleshooting

### Build fails
- Ensure you have enough disk space
- Check that all dependencies are properly listed in `package.json`

### Container won't start
- Check logs: `docker logs <container-id>`
- Verify port 3000 is not already in use
- Check environment variables

### Application not accessible
- Verify the container is running: `docker ps`
- Check port mapping: `docker port <container-id>`
- Ensure firewall rules allow traffic on port 3000

