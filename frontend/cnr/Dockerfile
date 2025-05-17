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
