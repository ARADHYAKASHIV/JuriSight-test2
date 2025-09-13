# JuriSight: Advanced Legal AI Platform - Full-Stack Setup Design

## Overview

JuriSight is a comprehensive AI-powered legal document analysis platform designed to streamline legal workflows through intelligent document processing, analysis, and collaborative features. This design outlines the complete full-stack architecture for a production-ready monorepo implementation.

### Core Value Proposition
- **Automated Legal Document Analysis**: AI-powered document processing with OCR fallback
- **Intelligent Insights**: RAG-based querying with vector similarity search
- **Collaborative Workspaces**: Team-based document management with RBAC
- **Comparative Analysis**: Clause-by-clause document comparison with similarity scoring
- **Real-time Analytics**: Usage tracking and performance monitoring

### Target Users
- Legal professionals and law firms
- Legal departments in corporations
- Compliance teams
- Contract managers

## Technology Stack & Dependencies

### Frontend Stack
- **Framework**: React 18+ with Vite for development
- **Styling**: TailwindCSS with Radix UI components
- **State Management**: Zustand for global state
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Testing**: React Testing Library + Cypress E2E

### Backend Stack
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Prisma for database operations
- **Caching**: Redis for session storage and query caching
- **Authentication**: JWT with Role-Based Access Control
- **File Processing**: Multer for uploads, pdf-parse for text extraction

### AI Integration
- **Primary**: Google Gemini API for document analysis
- **Secondary**: OpenAI GPT (fallback option)
- **Vector Search**: pgvector for embeddings storage
- **Text Processing**: Custom chunking and embedding pipeline

### DevOps & Infrastructure
- **Containerization**: Docker with Docker Compose
- **Reverse Proxy**: Nginx for load balancing and SSL termination
- **Monitoring**: OpenTelemetry for observability
- **CI/CD**: GitHub Actions with automated testing

## Architecture

### System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend]
        PWA[Progressive Web App]
    end
    
    subgraph "API Gateway"
        NGINX[Nginx Reverse Proxy]
        LB[Load Balancer]
    end
    
    subgraph "Application Layer"
        API[Express API Server]
        AUTH[Authentication Service]
        DOC[Document Service]
        AI[AI Processing Service]
        COMP[Comparison Service]
        ANAL[Analytics Service]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL + pgvector)]
        REDIS[(Redis Cache)]
        FILES[File Storage]
    end
    
    subgraph "External Services"
        GEMINI[Google Gemini API]
        OPENAI[OpenAI API]
        OCR[OCR Fallback Service]
    end
    
    UI --> NGINX
    PWA --> NGINX
    NGINX --> API
    API --> AUTH
    API --> DOC
    API --> AI
    API --> COMP
    API --> ANAL
    
    AUTH --> PG
    DOC --> PG
    DOC --> FILES
    AI --> PG
    AI --> REDIS
    AI --> GEMINI
    AI --> OPENAI
    COMP --> PG
    ANAL --> PG
    ANAL --> REDIS
    
    DOC --> OCR
```

### Component Architecture

#### Frontend Component Hierarchy

```mermaid
graph TD
    APP[App.tsx]
    APP --> ROUTER[Router]
    APP --> PROVIDERS[Global Providers]
    
    ROUTER --> DASH[Dashboard]
    ROUTER --> VIEWER[Document Viewer]
    ROUTER --> CHAT[Chat Interface]
    ROUTER --> ANALYTICS[Analytics]
    ROUTER --> SETTINGS[Settings]
    
    DASH --> SIDEBAR[Sidebar Navigation]
    DASH --> DOCGRID[Document Grid]
    DASH --> FILTERS[Filter Panel]
    DASH --> ACTIONS[Bulk Actions]
    
    VIEWER --> SPLIT[Split Screen Layout]
    VIEWER --> ANNOTATIONS[Annotation Layer]
    VIEWER --> NAVIGATION[Clause Navigation]
    
    CHAT --> SESSIONS[Chat Sessions]
    CHAT --> HISTORY[Chat History]
    CHAT --> CITATIONS[Source Citations]
    
    PROVIDERS --> AUTH_PROVIDER[Auth Provider]
    PROVIDERS --> QUERY_PROVIDER[Query Provider]
    PROVIDERS --> THEME_PROVIDER[Theme Provider]
```

#### Backend Service Architecture

```mermaid
graph TD
    ROUTER[Express Router]
    
    ROUTER --> AUTH_CTRL[Auth Controller]
    ROUTER --> DOC_CTRL[Document Controller]
    ROUTER --> AI_CTRL[AI Controller]
    ROUTER --> COMP_CTRL[Comparison Controller]
    ROUTER --> ANAL_CTRL[Analytics Controller]
    
    AUTH_CTRL --> AUTH_SVC[AuthService]
    DOC_CTRL --> DOC_SVC[DocumentService]
    AI_CTRL --> AI_SVC[AIService]
    COMP_CTRL --> COMP_SVC[ComparisonService]
    ANAL_CTRL --> ANAL_SVC[AnalyticsService]
    
    AUTH_SVC --> USER_REPO[UserRepository]
    DOC_SVC --> DOC_REPO[DocumentRepository]
    AI_SVC --> AI_REPO[AIRepository]
    COMP_SVC --> COMP_REPO[ComparisonRepository]
    ANAL_SVC --> ANAL_REPO[AnalyticsRepository]
    
    USER_REPO --> PRISMA[Prisma Client]
    DOC_REPO --> PRISMA
    AI_REPO --> PRISMA
    COMP_REPO --> PRISMA
    ANAL_REPO --> PRISMA
    
    AI_SVC --> GEMINI_CLIENT[Gemini Client]
    AI_SVC --> OPENAI_CLIENT[OpenAI Client]
    AI_SVC --> VECTOR_STORE[Vector Store]
    
    DOC_SVC --> FILE_STORAGE[File Storage]
    AUTH_SVC --> JWT_UTILS[JWT Utils]
    ALL_SVC --> REDIS_CLIENT[Redis Client]
```

## Data Models & Database Schema

### Core Entity Relationships

```mermaid
erDiagram
    USER ||--o{ WORKSPACE_MEMBER : belongs_to
    WORKSPACE ||--o{ WORKSPACE_MEMBER : has
    WORKSPACE ||--o{ DOCUMENT : contains
    WORKSPACE ||--o{ DOCUMENT_TEMPLATE : has
    USER ||--o{ DOCUMENT : uploads
    USER ||--o{ USER_ACTIVITY : performs
    DOCUMENT ||--o{ DOCUMENT_COMPARISON : compares
    DOCUMENT ||--o{ CHAT_SESSION : analyzes
    CHAT_SESSION ||--o{ CHAT_MESSAGE : contains
    DOCUMENT ||--o{ DOCUMENT_ANNOTATION : has
    
    USER {
        string id PK
        string email UK
        string password
        enum role
        json preferences
        datetime createdAt
        datetime updatedAt
    }
    
    WORKSPACE {
        string id PK
        string name
        string ownerId FK
        json settings
        datetime createdAt
        datetime updatedAt
    }
    
    WORKSPACE_MEMBER {
        string id PK
        string workspaceId FK
        string userId FK
        enum role
        json permissions
        datetime joinedAt
    }
    
    DOCUMENT {
        string id PK
        string workspaceId FK
        string uploadedById FK
        string title
        string originalName
        string mimeType
        string category
        json tags
        text content
        json metadata
        float confidenceScore
        int processingTime
        string hash
        datetime createdAt
        datetime updatedAt
    }
    
    DOCUMENT_TEMPLATE {
        string id PK
        string workspaceId FK
        string name
        string description
        json data
        datetime createdAt
        datetime updatedAt
    }
    
    DOCUMENT_COMPARISON {
        string id PK
        string doc1Id FK
        string doc2Id FK
        json results
        float similarityScore
        string performedById FK
        datetime createdAt
    }
    
    CHAT_SESSION {
        string id PK
        string documentId FK
        string userId FK
        string title
        json context
        datetime createdAt
        datetime updatedAt
    }
    
    CHAT_MESSAGE {
        string id PK
        string sessionId FK
        enum type
        text content
        json metadata
        json citations
        float confidenceScore
        datetime createdAt
    }
    
    DOCUMENT_ANNOTATION {
        string id PK
        string documentId FK
        string userId FK
        json position
        text content
        enum type
        datetime createdAt
        datetime updatedAt
    }
    
    USER_ACTIVITY {
        string id PK
        string userId FK
        string workspaceId FK
        enum type
        enum entityType
        string entityId
        json metadata
        datetime createdAt
    }
```

### Prisma Schema Structure

```prisma
// Core entities with relationships
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String
  role         UserRole @default(ANALYST)
  preferences  Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relations
  workspaces         WorkspaceMember[]
  uploadedDocuments  Document[]
  chatSessions       ChatSession[]
  annotations        DocumentAnnotation[]
  activities         UserActivity[]
  performedComparisons DocumentComparison[]
}

model Workspace {
  id        String   @id @default(cuid())
  name      String
  ownerId   String
  settings  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  members   WorkspaceMember[]
  documents Document[]
  templates DocumentTemplate[]
  activities UserActivity[]
}

model Document {
  id              String   @id @default(cuid())
  workspaceId     String
  uploadedById    String
  title           String
  originalName    String
  mimeType        String
  category        String?
  tags            Json?
  content         String?
  metadata        Json?
  confidenceScore Float?
  processingTime  Int?
  hash            String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  workspace    Workspace            @relation(fields: [workspaceId], references: [id])
  uploadedBy   User                 @relation(fields: [uploadedById], references: [id])
  chatSessions ChatSession[]
  annotations  DocumentAnnotation[]
  comparisons1 DocumentComparison[] @relation("Document1")
  comparisons2 DocumentComparison[] @relation("Document2")
}
```

## API Endpoints Reference

### Authentication & Authorization

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/profile
PUT    /api/auth/profile
```

**Authentication Flow:**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Manager, Analyst, Viewer)
- Session management with Redis storage

### Document Management

```http
GET    /api/documents                    # List documents with filters
POST   /api/documents                    # Upload new document
GET    /api/documents/:id                # Get document details
PUT    /api/documents/:id                # Update document metadata
DELETE /api/documents/:id                # Delete document
POST   /api/documents/:id/analyze        # Trigger AI analysis
GET    /api/documents/:id/download       # Download original file
```

**Request/Response Schema:**

```typescript
// Document upload request
interface DocumentUploadRequest {
  file: File;
  title?: string;
  category?: string;
  tags?: string[];
}

// Document analysis response
interface DocumentAnalysisResponse {
  id: string;
  analysis: {
    summary: string;
    keyPoints: string[];
    entities: Entity[];
    confidence: number;
  };
  embeddings: number[];
  processingTime: number;
}
```

### AI Processing & Chat

```http
POST   /api/ai/analyze                   # Analyze document content
POST   /api/ai/chat                      # Chat with document
GET    /api/ai/sessions/:documentId      # Get chat sessions
POST   /api/ai/sessions                  # Create chat session
GET    /api/ai/sessions/:id/messages     # Get chat messages
```

### Document Comparison

```http
POST   /api/comparisons                  # Create document comparison
GET    /api/comparisons/:id              # Get comparison results
GET    /api/comparisons                  # List comparisons
```

### Analytics & Reporting

```http
GET    /api/analytics/dashboard          # Dashboard metrics
GET    /api/analytics/usage              # Usage statistics
GET    /api/analytics/performance        # Performance metrics
```

## Business Logic Layer

### Document Processing Pipeline

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DocumentService
    participant AIService
    participant Database
    participant Storage
    participant Gemini
    
    Client->>API: POST /api/documents (file upload)
    API->>DocumentService: processUpload()
    DocumentService->>Storage: saveFile()
    DocumentService->>DocumentService: extractText()
    DocumentService->>Database: saveDocument()
    DocumentService->>AIService: analyzeDocument()
    AIService->>Gemini: sendForAnalysis()
    Gemini-->>AIService: analysisResult
    AIService->>Database: saveEmbeddings()
    AIService->>Database: saveAnalysis()
    AIService-->>DocumentService: analysisComplete
    DocumentService-->>API: documentProcessed
    API-->>Client: documentResponse
```

### AI Analysis Architecture

```mermaid
graph LR
    subgraph "Input Processing"
        UPLOAD[Document Upload]
        VALIDATE[Validation]
        EXTRACT[Text Extraction]
    end
    
    subgraph "AI Pipeline"
        CHUNK[Text Chunking]
        EMBED[Generate Embeddings]
        ANALYZE[AI Analysis]
        VALIDATE_AI[Response Validation]
    end
    
    subgraph "Storage"
        VECTOR_DB[Vector Database]
        METADATA[Metadata Storage]
        CACHE[Redis Cache]
    end
    
    UPLOAD --> VALIDATE
    VALIDATE --> EXTRACT
    EXTRACT --> CHUNK
    CHUNK --> EMBED
    CHUNK --> ANALYZE
    EMBED --> VECTOR_DB
    ANALYZE --> VALIDATE_AI
    VALIDATE_AI --> METADATA
    VALIDATE_AI --> CACHE
```

### RAG Implementation Flow

```mermaid
sequenceDiagram
    participant User
    participant ChatService
    participant VectorStore
    participant AIService
    participant Cache
    
    User->>ChatService: askQuestion(query, documentId)
    ChatService->>VectorStore: findSimilarChunks(query)
    VectorStore-->>ChatService: relevantChunks[]
    ChatService->>Cache: checkCachedResponse(queryHash)
    alt Cache Hit
        Cache-->>ChatService: cachedResponse
    else Cache Miss
        ChatService->>AIService: generateResponse(query, context)
        AIService-->>ChatService: aiResponse
        ChatService->>Cache: storeResponse(queryHash, response)
    end
    ChatService-->>User: formattedResponse
```

## State Management & Data Flow

### Frontend State Architecture

```mermaid
graph TD
    subgraph "Zustand Store"
        AUTH_STORE[Auth Store]
        DOC_STORE[Document Store]
        CHAT_STORE[Chat Store]
        UI_STORE[UI Store]
    end
    
    subgraph "React Query"
        QUERIES[API Queries]
        MUTATIONS[API Mutations]
        CACHE[Query Cache]
    end
    
    subgraph "Components"
        DASHBOARD[Dashboard]
        VIEWER[Document Viewer]
        CHAT_UI[Chat Interface]
    end
    
    AUTH_STORE --> DASHBOARD
    AUTH_STORE --> VIEWER
    AUTH_STORE --> CHAT_UI
    
    DOC_STORE --> DASHBOARD
    DOC_STORE --> VIEWER
    
    CHAT_STORE --> CHAT_UI
    UI_STORE --> DASHBOARD
    UI_STORE --> VIEWER
    UI_STORE --> CHAT_UI
    
    QUERIES --> AUTH_STORE
    QUERIES --> DOC_STORE
    QUERIES --> CHAT_STORE
    
    MUTATIONS --> CACHE
    CACHE --> QUERIES
```

### Backend Data Flow

```mermaid
graph LR
    subgraph "Controllers"
        AUTH_CTRL[Auth Controller]
        DOC_CTRL[Document Controller]
        AI_CTRL[AI Controller]
    end
    
    subgraph "Services"
        AUTH_SVC[Auth Service]
        DOC_SVC[Document Service]
        AI_SVC[AI Service]
    end
    
    subgraph "Repositories"
        USER_REPO[User Repository]
        DOC_REPO[Document Repository]
        AI_REPO[AI Repository]
    end
    
    subgraph "Data Sources"
        POSTGRES[(PostgreSQL)]
        REDIS[(Redis)]
        FILES[File Storage]
    end
    
    AUTH_CTRL --> AUTH_SVC
    DOC_CTRL --> DOC_SVC
    AI_CTRL --> AI_SVC
    
    AUTH_SVC --> USER_REPO
    DOC_SVC --> DOC_REPO
    AI_SVC --> AI_REPO
    
    USER_REPO --> POSTGRES
    DOC_REPO --> POSTGRES
    DOC_REPO --> FILES
    AI_REPO --> POSTGRES
    AI_REPO --> REDIS
```

## Deployment Architecture

### Docker Compose Structure

```mermaid
graph TB
    subgraph "Load Balancer"
        NGINX[Nginx Reverse Proxy]
    end
    
    subgraph "Application Services"
        FRONTEND[Frontend Container]
        BACKEND[Backend Container]
    end
    
    subgraph "Data Services"
        POSTGRES[PostgreSQL + pgvector]
        REDIS[Redis Cache]
    end
    
    subgraph "Volumes"
        PG_DATA[PostgreSQL Data]
        UPLOADS[File Uploads]
        LOGS[Application Logs]
    end
    
    NGINX --> FRONTEND
    NGINX --> BACKEND
    BACKEND --> POSTGRES
    BACKEND --> REDIS
    BACKEND --> UPLOADS
    
    POSTGRES --> PG_DATA
    BACKEND --> LOGS
    FRONTEND --> LOGS
```

### Production Environment Setup

```yaml
# docker-compose.prod.yml structure
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes: 
      - ./nginx/prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    
  frontend:
    build: ./client
    environment:
      - NODE_ENV=production
    
  backend:
    build: ./server
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    volumes:
      - uploads:/app/uploads
      - logs:/app/logs
    
  database:
    image: pgvector/pgvector:pg15
    environment:
      - POSTGRES_DB=jurisight
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
```

### CI/CD Pipeline Architecture

```mermaid
graph LR
    subgraph "Source Control"
        GIT[Git Repository]
        PR[Pull Request]
    end
    
    subgraph "CI Pipeline"
        TEST[Run Tests]
        LINT[Lint & Format]
        BUILD[Build Images]
        SCAN[Security Scan]
    end
    
    subgraph "CD Pipeline"
        DEPLOY_STAGING[Deploy to Staging]
        E2E[E2E Tests]
        DEPLOY_PROD[Deploy to Production]
        MONITOR[Health Check]
    end
    
    GIT --> PR
    PR --> TEST
    TEST --> LINT
    LINT --> BUILD
    BUILD --> SCAN
    SCAN --> DEPLOY_STAGING
    DEPLOY_STAGING --> E2E
    E2E --> DEPLOY_PROD
    DEPLOY_PROD --> MONITOR
```

## Testing Strategy

### Frontend Testing Architecture

```mermaid
graph TD
    subgraph "Unit Tests"
        COMPONENT_TESTS[Component Tests]
        HOOK_TESTS[Custom Hook Tests]
        UTIL_TESTS[Utility Function Tests]
    end
    
    subgraph "Integration Tests"
        API_INTEGRATION[API Integration Tests]
        STATE_INTEGRATION[State Management Tests]
        ROUTING_TESTS[Routing Tests]
    end
    
    subgraph "E2E Tests"
        USER_FLOWS[User Flow Tests]
        CROSS_BROWSER[Cross-browser Tests]
        ACCESSIBILITY[Accessibility Tests]
    end
    
    COMPONENT_TESTS --> RTL[React Testing Library]
    HOOK_TESTS --> RTL
    UTIL_TESTS --> JEST[Jest]
    
    API_INTEGRATION --> MSW[Mock Service Worker]
    STATE_INTEGRATION --> RTL
    ROUTING_TESTS --> RTL
    
    USER_FLOWS --> CYPRESS[Cypress]
    CROSS_BROWSER --> CYPRESS
    ACCESSIBILITY --> AXE[Axe-core]
```

### Backend Testing Strategy

```mermaid
graph TD
    subgraph "Unit Tests"
        SERVICE_TESTS[Service Layer Tests]
        CONTROLLER_TESTS[Controller Tests]
        UTIL_TESTS[Utility Tests]
    end
    
    subgraph "Integration Tests"
        API_TESTS[API Endpoint Tests]
        DB_TESTS[Database Tests]
        CACHE_TESTS[Redis Cache Tests]
    end
    
    subgraph "System Tests"
        AI_TESTS[AI Integration Tests]
        FILE_TESTS[File Processing Tests]
        AUTH_TESTS[Authentication Tests]
    end
    
    SERVICE_TESTS --> JEST[Jest + Supertest]
    CONTROLLER_TESTS --> JEST
    UTIL_TESTS --> JEST
    
    API_TESTS --> TEST_DB[Test Database]
    DB_TESTS --> TEST_DB
    CACHE_TESTS --> TEST_REDIS[Test Redis]
    
    AI_TESTS --> MOCK_AI[Mock AI Services]
    FILE_TESTS --> TEST_FILES[Test Files]
    AUTH_TESTS --> JWT_MOCK[JWT Mocking]
```