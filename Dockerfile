# Stage 1: Build stage
FROM node:14 AS build

# Install build-essential and other dependencies needed for building
RUN apt-get update && apt-get install -y build-essential

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install all dependencies (including devDependencies for build tools)
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variable for build
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:14-alpine

# Set the working directory for the production container
WORKDIR /usr/src/app

# Install a lightweight HTTP server to serve the production build
RUN npm install -g serve

# Copy the build artifacts from the previous stage
COPY --from=build /usr/src/app/build ./build

# Expose port 3000 for the application
EXPOSE 3000

# Copy the entrypoint script into the image and give execution permissions
COPY entrypoint.sh /usr/src/app/build/entrypoint.sh
RUN chmod +x /usr/src/app/build/entrypoint.sh

# Debug: Ensure the entrypoint.sh exists and has the correct permissions
RUN ls -la /usr/src/app/build/entrypoint.sh

# Set the environment variable for production
ENV NODE_ENV=production

# Use entrypoint script to run the application
ENTRYPOINT ["/usr/src/app/build/entrypoint.sh"]
