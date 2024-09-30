#!/bin/sh

# Create a config.js file embedding the environment variables
cat <<EOF > /usr/src/app/build/config.js
window.REACT_APP_API_BASE_URL = "$REACT_APP_API_BASE_URL";
EOF

# Start the server to serve the built React app
exec serve -s build
