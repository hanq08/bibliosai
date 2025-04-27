# BibliosAI Deployment Guide

This guide provides instructions for deploying BibliosAI to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Manual Deployment](#manual-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Security Considerations](#security-considerations)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Backup and Recovery](#backup-and-recovery)
10. [Scaling](#scaling)

## Prerequisites

Before deploying BibliosAI to production, ensure you have:

- A domain name for your deployment
- SSL certificates for HTTPS
- Access to a production-ready database (MongoDB)
- Access to a vector database (Pinecone, Chroma, etc.)
- Sufficient server resources based on expected usage

## Deployment Options

BibliosAI can be deployed in several ways:

1. **Docker Deployment**: Using Docker and Docker Compose
2. **Cloud Deployment**: Using cloud providers like AWS, GCP, or Azure
3. **Manual Deployment**: Traditional server setup

## Docker Deployment

### Using Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bibliosai.git
   cd bibliosai
   ```

2. Create a production `.env` file:
   ```bash
   cp .env.example .env.prod
   # Edit .env.prod with production values
   ```

3. Create a `docker-compose.yml` file:
   ```yaml
   version: '3.8'

   services:
     backend:
       build: ./backend
       restart: always
       ports:
         - "8000:8000"
       env_file:
         - .env.prod
       depends_on:
         - mongodb
         - chroma
       volumes:
         - ./logs:/app/logs

     frontend:
       build: ./frontend
       restart: always
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./ssl:/etc/nginx/ssl
         - ./nginx.conf:/etc/nginx/conf.d/default.conf

     mongodb:
       image: mongo:latest
       restart: always
       volumes:
         - mongodb_data:/data/db
       ports:
         - "27017:27017"

     chroma:
       image: ghcr.io/chroma-core/chroma:latest
       restart: always
       volumes:
         - chroma_data:/chroma/chroma
       ports:
         - "8001:8000"

   volumes:
     mongodb_data:
     chroma_data:
   ```

4. Create an Nginx configuration for the frontend:
   ```nginx
   # nginx.conf
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;

       # SSL settings
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
       ssl_session_timeout 1d;
       ssl_session_cache shared:SSL:10m;
       ssl_session_tickets off;

       # Security headers
       add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
       add_header X-Content-Type-Options nosniff;
       add_header X-Frame-Options DENY;
       add_header X-XSS-Protection "1; mode=block";

       location / {
           root /usr/share/nginx/html;
           try_files $uri $uri/ /index.html;
           add_header Cache-Control "no-store, no-cache, must-revalidate";
       }

       location /static {
           root /usr/share/nginx/html;
           expires 1y;
           add_header Cache-Control "public, max-age=31536000";
       }

       location /api {
           proxy_pass http://backend:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

### Using Kubernetes

For larger deployments, Kubernetes is recommended:

1. Create Kubernetes manifests in a `k8s` directory
2. Use Helm charts for easier deployment
3. Set up autoscaling, load balancing, and high availability

## Cloud Deployment

### AWS Deployment

1. **Backend**:
   - Deploy using AWS Elastic Beanstalk or ECS
   - Use RDS for MongoDB or DocumentDB
   - Use S3 for file storage
   - Set up CloudFront for content delivery

2. **Frontend**:
   - Build the React app
   - Deploy to S3 with CloudFront distribution
   - Set up Route 53 for DNS

3. **Vector Database**:
   - Use a managed service like Pinecone
   - Or deploy Chroma on EC2/ECS

### GCP Deployment

1. **Backend**:
   - Deploy using Google App Engine or Cloud Run
   - Use MongoDB Atlas or deploy MongoDB on GCE
   - Use Cloud Storage for file storage
   - Set up Cloud CDN for content delivery

2. **Frontend**:
   - Build the React app
   - Deploy to Firebase Hosting or Cloud Storage
   - Set up Cloud DNS for domain management

### Azure Deployment

1. **Backend**:
   - Deploy using Azure App Service or AKS
   - Use Cosmos DB with MongoDB API
   - Use Azure Blob Storage for file storage
   - Set up Azure CDN for content delivery

2. **Frontend**:
   - Build the React app
   - Deploy to Azure Static Web Apps
   - Set up Azure DNS for domain management

## Manual Deployment

### Backend Deployment

1. Set up a server with Python 3.9+
2. Clone the repository
3. Create a virtual environment
4. Install dependencies
5. Set up environment variables
6. Use Gunicorn with Nginx as a reverse proxy:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
   ```

### Frontend Deployment

1. Build the React app:
   ```bash
   cd frontend
   npm run build
   ```
2. Set up Nginx to serve the static files
3. Configure SSL with Let's Encrypt
4. Set up proper caching and compression

## Environment Configuration

### Production Environment Variables

Create a `.env.prod` file with the following variables:

```
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false
ENVIRONMENT=production

# Security
SECRET_KEY=your-secure-random-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# Database
MONGODB_URI=mongodb://your-production-mongodb-uri
MONGODB_DB_NAME=bibliosai_prod

# Vector Database
VECTOR_DB_TYPE=pinecone  # or chroma
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_NAME=bibliosai-prod

# LLM Configuration
OPENAI_API_KEY=your-openai-api-key
MODEL_NAME=gpt-4

# Frontend URL
FRONTEND_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com

# Logging
LOG_LEVEL=WARNING
LOG_FILE=/path/to/logs/bibliosai.log
```

### Frontend Environment Variables

Create a `.env.production` file in the frontend directory:

```
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_ENVIRONMENT=production
```

## Security Considerations

### API Security

1. **Rate Limiting**: Implement rate limiting to prevent abuse
2. **Input Validation**: Validate all user inputs
3. **CORS Configuration**: Restrict CORS to your domain
4. **API Keys**: Secure storage and rotation of API keys
5. **JWT Security**: Use secure JWT configuration

### Data Security

1. **Encryption**: Encrypt sensitive data at rest
2. **OAuth Security**: Secure handling of OAuth tokens
3. **Data Minimization**: Only store necessary data
4. **Regular Audits**: Conduct security audits

### Infrastructure Security

1. **Firewall Configuration**: Restrict access to necessary ports
2. **VPC/Network Security**: Use private networks where possible
3. **Regular Updates**: Keep all systems updated
4. **Security Groups**: Properly configure security groups

## Monitoring and Logging

### Logging Configuration

1. Set up centralized logging with ELK Stack or similar
2. Configure log rotation and retention
3. Implement structured logging

### Monitoring

1. Set up health checks for all services
2. Implement metrics collection with Prometheus
3. Create dashboards with Grafana
4. Set up alerts for critical issues

### Performance Monitoring

1. Monitor API response times
2. Track database performance
3. Monitor resource usage (CPU, memory, disk)
4. Set up tracing with Jaeger or similar

## Backup and Recovery

### Database Backup

1. Set up regular MongoDB backups
2. Store backups in a secure location
3. Test backup restoration regularly

### Vector Database Backup

1. Set up regular vector database backups
2. Implement point-in-time recovery
3. Document recovery procedures

### Disaster Recovery

1. Create a disaster recovery plan
2. Set up multi-region redundancy
3. Document recovery procedures
4. Conduct regular disaster recovery drills

## Scaling

### Horizontal Scaling

1. Scale the backend with multiple instances
2. Use a load balancer to distribute traffic
3. Implement stateless design for easy scaling

### Database Scaling

1. Set up MongoDB sharding for horizontal scaling
2. Implement read replicas for read-heavy workloads
3. Use connection pooling

### Caching

1. Implement Redis for caching
2. Cache frequently accessed data
3. Use CDN for static assets

### Auto-scaling

1. Set up auto-scaling based on metrics
2. Define scaling policies
3. Monitor scaling events

## Continuous Integration and Deployment

### CI/CD Pipeline

1. Set up GitHub Actions or similar CI/CD tool
2. Automate testing and deployment
3. Implement blue-green deployment
4. Set up rollback procedures

### Deployment Checklist

Before each production deployment:

1. Run all tests
2. Check for security vulnerabilities
3. Perform database migrations
4. Update documentation
5. Notify stakeholders

## Post-Deployment

### Verification

1. Verify all services are running
2. Check logs for errors
3. Run smoke tests
4. Monitor performance

### Documentation

1. Update deployment documentation
2. Document any issues and solutions
3. Update runbooks

## Support and Maintenance

1. Set up a support system
2. Create maintenance windows
3. Document common issues and solutions
4. Train support staff
