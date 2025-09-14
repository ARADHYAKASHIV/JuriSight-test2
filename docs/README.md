# JuriSight Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ with pgvector extension
- Redis 6+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd jurisight
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example apps/backend/.env
   # Edit apps/backend/.env with your configuration
   ```

3. **Database setup:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Database Studio: `npm run db:studio`

### Docker Development
```bash
npm run docker:dev
```

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18, TypeScript, TailwindCSS, Radix UI, Zustand, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, JWT Auth
- **Database**: PostgreSQL with pgvector extension
- **AI**: Google Gemini API, OpenAI API (fallback)
- **Caching**: Redis
- **Deployment**: Docker, Nginx

### Core Features Implemented
✅ **Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Manager, Analyst, Viewer)
- Workspace-based permissions

✅ **Document Management**
- Multi-format document upload (PDF, DOC, DOCX, TXT)
- Text extraction and processing
- Document categorization and tagging
- File storage with deduplication

✅ **AI-Powered Analysis**
- Google Gemini API integration
- Document summarization and key point extraction
- Vector embeddings for similarity search
- RAG (Retrieval-Augmented Generation) implementation

✅ **Chat Interface**
- Document-based Q&A system
- Session management
- Citation and source tracking
- Real-time AI responses

✅ **Document Comparison**
- AI-powered document comparison
- Similarity scoring
- Clause-by-clause analysis
- Difference highlighting

✅ **Analytics & Monitoring**
- Usage statistics and metrics
- Performance monitoring
- User activity tracking
- Dashboard analytics

✅ **Deployment Ready**
- Docker containerization
- Production environment configuration
- Nginx reverse proxy setup
- Health monitoring

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests
npm run test:backend

# Frontend tests  
npm run test:frontend

# Test coverage
npm run test:coverage
```

## 🚀 Production Deployment

1. **Configure environment:**
   ```bash
   cp .env.production .env
   # Update with production values
   ```

2. **Deploy with Docker:**
   ```bash
   ./scripts/deploy.sh production
   ```

3. **Manual deployment:**
   ```bash
   npm run build
   npm run db:migrate
   npm start
   ```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get document details
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/analyze` - Analyze document

### Chat
- `GET /api/chat/sessions` - List chat sessions
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions/:id/messages` - Get messages
- `POST /api/chat/messages` - Send message

### Comparisons
- `GET /api/comparisons` - List comparisons
- `POST /api/comparisons` - Create comparison
- `GET /api/comparisons/:id` - Get comparison results

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/usage` - Usage statistics
- `GET /api/analytics/performance` - Performance metrics

## 🔧 Configuration

### Environment Variables
See `.env.example` for all configuration options.

Key configurations:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `JWT_SECRET` - JWT signing secret
- `UPLOAD_PATH` - File upload directory

### Database Schema
The application uses Prisma ORM with a comprehensive schema supporting:
- User management and authentication
- Workspace and team collaboration
- Document storage and metadata
- Chat sessions and messages
- Document comparisons
- Analytics and activity tracking

## 🛠️ Development Guidelines

### Code Structure
```
apps/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Route components
│   │   ├── services/   # API clients
│   │   ├── stores/     # State management
│   │   └── hooks/      # Custom React hooks
└── backend/           # Express API server
    ├── src/
    │   ├── routes/     # API route handlers
    │   ├── services/   # Business logic
    │   ├── middleware/ # Express middleware
    │   └── utils/      # Utility functions
    └── prisma/        # Database schema and migrations
```

### Adding New Features

1. **Database changes:**
   ```bash
   # Update schema in prisma/schema.prisma
   npm run db:push
   ```

2. **Add API endpoints:**
   - Create route handler in `src/routes/`
   - Add service logic in `src/services/`
   - Update API client in frontend

3. **Add UI components:**
   - Create component in `apps/frontend/src/components/`
   - Add routing in `App.tsx`
   - Connect with API using TanStack Query

### Best Practices
- Use TypeScript for type safety
- Follow REST API conventions
- Implement proper error handling
- Add comprehensive logging
- Write tests for critical functionality
- Use proper database indexing
- Implement rate limiting
- Follow security best practices

## 📊 Monitoring & Maintenance

### Health Checks
- Application health: `GET /health`
- Database connectivity check
- Redis connectivity check
- AI service availability

### Logging
- Structured logging with Winston
- Request/response logging
- Error tracking
- Performance metrics

### Backup & Recovery
- Database backups (implement based on your infrastructure)
- File storage backups
- Configuration backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information