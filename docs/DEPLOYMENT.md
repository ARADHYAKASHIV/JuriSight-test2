# JuriSight Production Deployment

This guide covers deploying JuriSight to production using Docker and various cloud platforms.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm
- PostgreSQL database (Neon, AWS RDS, or self-hosted)
- AI API keys (OpenAI and/or Google Gemini)

## Environment Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_REFRESH_SECRET="your-super-secure-jwt-refresh-secret-key-here"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"

# Server Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGIN="https://your-domain.com"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH="./uploads"

# Redis (for caching and sessions)
REDIS_URL="redis://username:password@host:port"

# Email (optional)
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
```

### Frontend Environment Variables (.env.production)

```env
VITE_API_URL="https://api.your-domain.com"
VITE_APP_NAME="JuriSight"
VITE_APP_VERSION="1.0.0"
```

## Docker Configuration

### Multi-stage Dockerfile for Backend

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/backend/ ./apps/backend/
COPY prisma/ ./prisma/

# Build the application
WORKDIR /app/apps/backend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Copy built application
COPY --from=builder --chown=backend:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma
COPY --from=builder --chown=backend:nodejs /app/apps/backend/package*.json ./

# Create uploads directory
RUN mkdir -p uploads && chown backend:nodejs uploads

USER backend

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### Multi-stage Dockerfile for Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend/ ./apps/frontend/

# Build the application
WORKDIR /app/apps/frontend
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nginx
RUN adduser -S frontend -u 1001

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose for Production

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    container_name: jurisight-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    ports:
      - "3001:3001"
    volumes:
      - uploads:/app/uploads
    depends_on:
      - redis
    networks:
      - jurisight-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    container_name: jurisight-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro  # SSL certificates
    depends_on:
      - backend
    networks:
      - jurisight-network

  redis:
    image: redis:7-alpine
    container_name: jurisight-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - jurisight-network
    command: redis-server --appendonly yes

volumes:
  uploads:
  redis-data:

networks:
  jurisight-network:
    driver: bridge
```

## Nginx Configuration

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Security headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Upstream backend
    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name _;

        # Redirect HTTP to HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name _;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Root directory
        root /usr/share/nginx/html;
        index index.html;

        # Client max body size (for file uploads)
        client_max_body_size 10M;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Auth endpoints with stricter rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files with caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            try_files $uri =404;
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
            
            # Security headers for HTML
            add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com;" always;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Deployment Scripts

### deploy.sh

```bash
#!/bin/bash

set -e

echo "🚀 Starting JuriSight deployment..."

# Load environment variables
source .env.production

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build applications
echo "🔨 Building applications..."
npm run build

# Database migrations
echo "🗄️ Running database migrations..."
cd apps/backend
npx prisma generate
npx prisma db push
cd ../..

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start new containers
echo "▶️ Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

# Health check
echo "🏥 Performing health check..."
sleep 10
curl -f http://localhost/health || (echo "❌ Health check failed" && exit 1)

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at: https://your-domain.com"
```

## Cloud Platform Deployment

### AWS Deployment (ECS + RDS)

1. **Create RDS Database**
```bash
aws rds create-db-instance \
    --db-instance-identifier jurisight-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password your-password \
    --allocated-storage 20
```

2. **Push to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker build -t jurisight-backend ./apps/backend
docker tag jurisight-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/jurisight-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/jurisight-backend:latest
```

3. **Deploy with ECS**
```yaml
# task-definition.json
{
  "family": "jurisight",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/jurisight-backend:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/jurisight",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Vercel Deployment (Frontend)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://api.your-domain.com"
  }
}
```

### Railway Deployment

```dockerfile
# railway.dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

WORKDIR /app/apps/backend
RUN npm run build

EXPOSE $PORT

CMD ["npm", "start"]
```

## Monitoring and Logging

### Health Check Endpoints

```typescript
// apps/backend/src/routes/healthRoutes.ts
import { Router } from 'express'
import { prisma } from '@/lib/prisma'

const router = Router()

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

export default router
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain name configured
- [ ] CDN setup (optional)
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring (New Relic/DataDog)
- [ ] Log aggregation (ELK stack)

## Scaling Considerations

1. **Horizontal Scaling**
   - Use multiple backend instances behind a load balancer
   - Implement session storage in Redis
   - Use CDN for static assets

2. **Database Optimization**
   - Connection pooling
   - Read replicas
   - Query optimization
   - Indexing strategy

3. **Caching Strategy**
   - Redis for session storage
   - CDN for static assets
   - Application-level caching

4. **Performance Monitoring**
   - APM tools integration
   - Custom metrics and alerts
   - Regular performance audits

## Security Best Practices

1. **Network Security**
   - VPC with private subnets
   - Security groups and NACLs
   - WAF for application protection

2. **Application Security**
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection
   - CSRF tokens

3. **Data Protection**
   - Encryption at rest and in transit
   - Regular security audits
   - Compliance with data protection regulations

4. **Access Control**
   - IAM roles and policies
   - Multi-factor authentication
   - Regular access reviews