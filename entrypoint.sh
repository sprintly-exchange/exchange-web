#!/bin/sh

# Create the .env file dynamically with environment variables
cat <<EOF > /usr/src/app/.env
REACT_APP_API_BASE_URL="${REACT_APP_API_BASE_URL}"
REACT_APP_OTHER_ENV_VAR="${REACT_APP_OTHER_ENV_VAR}"  # Add other variables as needed
EOF

# (Optional) Add a message to indicate the file was created
echo ".env file created with the following content:"
cat /usr/src/app/.env  # Display the content of the .env file for verification

# Start the server to serve the built React app
exec serve -s /usr/src/app/build
