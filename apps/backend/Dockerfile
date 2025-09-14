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
RUN apk add --no-cache dumb-init curl

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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]