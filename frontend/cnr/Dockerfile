# Stage 1: Use Nginx to serve the static files
FROM nginx:alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Vite app (dist/) into the Nginx html directory
COPY dist/ /usr/share/nginx/html

# Optional: for React Router or SPA support
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# # Stage 1: Build the React app
# FROM node:22.14.0-alpine AS build

# WORKDIR /app

# # Copy and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy the app and build it
# COPY . .
# RUN npm run build

# # Stage 2: Serve the built app
# FROM node:22.14.0-alpine

# WORKDIR /app

# # Install the 'serve' package globally
# RUN npm install -g serve

# # Copy the build from the previous stage
# COPY --from=build /app/build ./build

# # Expose the port serve will listen on
# EXPOSE 5000

# # Start the app
# CMD ["serve", "-s", "build", "-l", "5000"]
