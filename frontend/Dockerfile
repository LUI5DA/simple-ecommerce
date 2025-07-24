# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first (mejor para cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code (incluyendo postcss.config.js y tailwind.config.js)
COPY . .

# Debug (opcional): asegúrate de que postcss.config.js está bien
RUN echo "======= POSTCSS CONFIG =======" && cat postcss.config.js

# Build React app
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy static files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration if it exists
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
