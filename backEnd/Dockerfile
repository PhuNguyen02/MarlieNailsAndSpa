# ==========================================
# Backend Dockerfile - NestJS + MySQL
# Multi-stage build for optimized production image
# ==========================================

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better Docker layer caching)
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code & config files
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ ./src/

# Build the NestJS application
RUN npm run build

# ---------- Stage 2: Production ----------
FROM node:20-alpine AS production

# Add labels for image metadata
LABEL maintainer="MarlieNailsAndSpa"
LABEL description="Backend API - NestJS + TypeORM + MySQL"

# Install dumb-init for proper PID 1 signal handling
RUN apk add --no-cache dumb-init curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R nestjs:nodejs uploads

# Set ownership of app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Environment variables with defaults
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (default 8080 for cloud platforms like Render/Railway)
EXPOSE ${PORT}

# Health check - NestJS API endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api || exit 1

# Use dumb-init to handle PID 1 properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]
