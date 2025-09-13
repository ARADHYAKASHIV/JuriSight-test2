# JuriSight: Advanced Legal AI Platform

JuriSight is a comprehensive AI-powered legal document analysis platform designed to streamline legal workflows through intelligent document processing, analysis, and collaborative features.

## 🚀 Features

- **Automated Legal Document Analysis**: AI-powered document processing with OCR fallback
- **Intelligent Insights**: RAG-based querying with vector similarity search
- **Collaborative Workspaces**: Team-based document management with RBAC
- **Comparative Analysis**: Clause-by-clause document comparison with similarity scoring
- **Real-time Analytics**: Usage tracking and performance monitoring

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18+ with Vite
- TailwindCSS with Radix UI components
- Zustand for state management
- TanStack Query for data fetching

**Backend:**
- Node.js with Express.js
- PostgreSQL with pgvector extension
- Prisma ORM
- Redis for caching
- JWT authentication with RBAC

**AI Integration:**
- Google Gemini API for document analysis
- OpenAI GPT (fallback option)
- Vector embeddings for similarity search

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL with pgvector extension
- Redis
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/jurisight.git
   cd jurisight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   # Edit the .env file with your configuration
   ```

4. **Setup database:**
   ```bash
   npm run db:push
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Docker Development

```bash
npm run docker:dev
```

### Production Deployment

```bash
npm run docker:prod
```

## 📁 Project Structure

```
jurisight/
├── apps/                          # Applications
│   ├── frontend/                  # React frontend application
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── pages/            # Application pages
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── services/         # API client services
│   │   │   ├── stores/           # Zustand stores
│   │   │   └── utils/            # Utility functions
│   │   └── package.json
│   └── backend/                   # Express.js backend application
│       ├── src/
│       │   ├── controllers/       # Route controllers
│       │   ├── services/         # Business logic services
│       │   ├── repositories/     # Data access layer
│       │   ├── middleware/       # Custom middleware
│       │   ├── utils/            # Utility functions
│       │   └── types/            # TypeScript type definitions
│       ├── prisma/               # Database schema and migrations
│       └── package.json
├── packages/                      # Shared packages
│   └── shared/                   # Shared types and utilities
├── docker/                       # Docker configuration
├── docs/                         # Documentation
├── scripts/                      # Build and deployment scripts
└── package.json                  # Root package.json
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jurisight"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"

# File Storage
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE="10485760"

# Server
PORT=3001
NODE_ENV="development"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## 📊 Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## 🚀 Deployment

### Docker Production

1. **Build and deploy:**
   ```bash
   npm run docker:prod
   ```

2. **Services will be available at:**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - Database: Internal network

### Manual Deployment

1. **Build applications:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@jurisight.com or join our Slack channel.