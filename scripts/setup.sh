#!/bin/bash

# JuriSight Setup Script
set -e

echo "🚀 Setting up JuriSight development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Please install Node.js 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required. Please install npm"; exit 1; }

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment files
echo "⚙️ Setting up environment configuration..."
if [ ! -f "apps/backend/.env" ]; then
    cp .env.example apps/backend/.env
    echo "✅ Created apps/backend/.env from template"
    echo "📝 Please edit apps/backend/.env with your configuration"
else
    echo "✅ apps/backend/.env already exists"
fi

# Build shared package
echo "🔧 Building shared package..."
cd packages/shared
npm run build
cd ../..

# Setup database (if available)
echo "🗄️ Setting up database..."
if command -v docker >/dev/null 2>&1; then
    echo "🐳 Docker detected - you can use 'npm run docker:dev' for full setup"
else
    echo "⚠️ Docker not found - manual database setup required"
    echo "   Please ensure PostgreSQL with pgvector extension is running"
    echo "   Then run: npm run db:push && npm run db:seed"
fi

# Setup complete
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Configure your environment variables in apps/backend/.env"
echo "   2. Start the development servers:"
echo "      - Full stack: npm run dev"
echo "      - With Docker: npm run docker:dev"
echo "   3. Open http://localhost:5173 to view the application"
echo ""
echo "📖 For more information, see docs/README.md"