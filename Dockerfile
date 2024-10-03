FROM node:14

# Install build-essential and other dependencies
RUN apt-get update && apt-get install -y build-essential

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install && npm install -g serve

# Copy the rest of the application code to the working directory
COPY . .

# Set the environment variable inside the container
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Copy the entrypoint script into the image and give execution permissions
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Debug: Ensure the entrypoint.sh exists and has the correct permissions
RUN ls -la /entrypoint.sh

# Define the entrypoint script to run
ENTRYPOINT ["/entrypoint.sh"]
