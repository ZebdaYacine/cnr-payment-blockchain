# Use Nginx to serve static files
FROM nginx:alpine

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built Vite app from local 'dist' folder to Nginx web root
COPY dist/ /usr/share/nginx/html

# Optional: for React Router / SPA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# # Stage 1: Build the React app using Node.js
# FROM node:22.14.0 AS builder

# # Create app directory
# WORKDIR /app

# # Install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy all files (including tsconfig.json, public/, src/, etc.)
# COPY . .

# # Build the app
# RUN npm run build

# # Stage 2: Serve the app using Nginx
# FROM nginx:alpine

# # Remove default Nginx website
# RUN rm -rf /usr/share/nginx/html/*

# # Copy built files from the builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Copy custom Nginx config for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
