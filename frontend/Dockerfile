# Use a Node image to build the Vue.js app
FROM node:16 as build-stage

# Set working directory
WORKDIR /tmphoto_app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Stage 2: Serve the Vue.js app using Nginx
FROM nginx:stable-alpine as production-stage

# Copy the built app from the previous stage
COPY --from=build-stage /tmphoto_app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx and keep it running
CMD ["nginx", "-g", "daemon off;"]
