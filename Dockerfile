# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install && npm install -g serve

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Copy the entrypoint script into the image
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Start server using the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
