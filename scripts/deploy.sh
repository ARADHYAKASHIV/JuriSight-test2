#!/bin/bash

# JuriSight Deployment Script
set -e

echo "🚀 Starting JuriSight deployment..."

# Check requirements
echo "📋 Checking requirements..."
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed."; exit 1; }

# Set environment
ENVIRONMENT=${1:-development}
echo "🌍 Environment: $ENVIRONMENT"

# Build and start services
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Starting production deployment..."
    
    # Pull latest images
    docker-compose -f docker-compose.prod.yml pull
    
    # Start services
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for database to be ready
    echo "⏳ Waiting for database..."
    sleep 30
    
    # Run database migrations
    docker-compose -f docker-compose.prod.yml exec -T backend npm run db:migrate
    
    # Seed database if needed
    docker-compose -f docker-compose.prod.yml exec -T backend npm run db:seed
    
else
    echo "🛠️ Starting development deployment..."
    
    # Start development services
    docker-compose -f docker-compose.dev.yml up -d --build
    
    # Wait for database to be ready
    echo "⏳ Waiting for database..."
    sleep 20
    
    # Run database setup
    docker-compose -f docker-compose.dev.yml exec -T backend npm run db:push
    docker-compose -f docker-compose.dev.yml exec -T backend npm run db:seed
fi

# Health check
echo "🏥 Performing health check..."
sleep 10

if curl -f http://localhost/health >/dev/null 2>&1; then
    echo "✅ Deployment successful!"
    echo "🌐 Frontend: http://localhost"
    echo "🔗 API: http://localhost/api"
    echo "📊 Logs: docker-compose -f docker-compose.$ENVIRONMENT.yml logs -f"
else
    echo "❌ Health check failed!"
    echo "📋 Check logs: docker-compose -f docker-compose.$ENVIRONMENT.yml logs"
    exit 1
fi