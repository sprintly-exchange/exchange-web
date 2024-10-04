#!/bin/sh

# Create config.js file dynamically with environment variables
cat <<EOF > /usr/src/app/build/config.js
window.REACT_APP_API_BASE_URL = "${REACT_APP_API_BASE_URL}";
EOF

# Start the server to serve the built React app
exec serve -s /usr/src/app/build
