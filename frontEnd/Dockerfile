# ==========================================
# Frontend Dockerfile - React + Vite + Nginx
# Multi-stage build for optimized production image
# ==========================================

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for API base URL (can be overridden at build time)
ARG VITE_API_BASE_URL=http://localhost:8080/api

# Set as environment variable for Vite build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copy package files first (better Docker layer caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy config files
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./

# Copy source code & public assets
COPY public/ ./public/
COPY src/ ./src/
COPY scripts/ ./scripts/ 

# Build the application
RUN npm run build

# ---------- Stage 2: Production with Nginx ----------
FROM nginx:1.27-alpine AS production

# Add labels for image metadata
LABEL maintainer="MarlieNailsAndSpa"
LABEL description="Frontend SPA - React + Vite served by Nginx"

# Install curl for health check
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
