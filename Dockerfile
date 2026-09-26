# ==========================================
# Stage 1: Build React/Vite application
# ==========================================

FROM node:22-alpine AS builder

WORKDIR /app

# Allow passing VITE_API_URL at build time with fallback
ARG VITE_API_URL=https://api.franchys.dynv6.net/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build production application
RUN npm run build


# ==========================================
# Stage 2: Serve with Nginx
# ==========================================

FROM nginx:alpine

# Remove default Nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy React/Vite build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose container port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]