  export const fsTemplate = {
    "connectionName": "File System",
    "path": "/<folder path>",
    "retryInterval": 0,
    "retryAttemps": 0,
    "protocol": "FS",
  };

 export const noAuthTemplate = {
    "connectionName": "Basic HTTP Connection",
    "host": "https://hostname",
    "port": 443,
    "protocol": "HTTP",
    "retryInterval": 0,
    "retryAttemps": 0,
    "authenticationType": "noAuth",
    "basePath": "/basepath",
    "headers.Content-Type": "application/json",
    "headers.Accept": "application/json",
    "method": ["Select HTTP Method","GET","POST","PUT","DELETE"],
  };


  export const basicAuthTemplate = {
    "connectionName": "HTTP with Basic Authentication",
    "host": "https://hostname",
    "port": 443,
    "protocol": "HTTP",
    "retryInterval": 0,
    "retryAttemps": 0,
    "authenticationType": "basicAuth",
    "basePath": "/basepath",
    "headers.Content-Type": "application/json",
    "headers.Accept": "application/json",
    "method": ["Select HTTP Method","GET","POST","PUT","DELETE"],
    "userName": "User Name",
    "password": "password",
  };
  

  export const jwtTemplate = {
    "connectionName": "HTTP with JWT",
    "host": "https://hostname",
    "port": 443,
    "protocol": "HTTP",
    "retryInterval": 0,
    "retryAttemps": 0,
    "authenticationType": "JWT",
    "basePath": "/basepath",
    "headers.Content-Type": "application/json",
    "headers.Accept": "application/json",
    "method": ["Select HTTP Method","GET","POST","PUT","DELETE"],
};

export const oAuth2Template = {
  "connectionName": "HTTP with oAuth 2.0",
  "host": "https://hostname",
  "port": 443,
  "protocol": "HTTP",
  "retryInterval": 0,
  "retryAttemps": 0,
  "authenticationType": "OAuth2.0",
  "basePath": "/basepath",
  "headers.Content-Type": "application/json",
  "headers.Accept": "application/json",
  "method": ["GET","POST","PUT","DELETE"],
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "tokenUrl": "https://authorization-server.com/token",
  "scope": "your-scope",
  "grantType": ["client_credentials","authorization_code","password"], // or other grant types like "authorization_code", "password", etc.
};

export const openIDConnectTemplate = {
  "connectionName": "HTTP with OpenId Connect",
  "host": "https://hostname",
  "port": 443,
  "protocol": "HTTP",
  "retryInterval": 0,
  "retryAttempts": 0,
  "authenticationType": "openidConnect",
  "basePath": "/basepath",
  "headers.Content-Type": "application/json",
  "headers.Accept": "application/json",
  "method": ["GET","POST","PUT","DELETE"],
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "authUrl": "https://authserver.com/auth", // Authorization server URL
  "tokenUrl": "https://authserver.com/token", // Token endpoint URL
  "redirectUri": "https://yourapp.com/callback", // Redirect URI for your application
  "scope": "openid profile email", // Scopes to request
  "grantType": ["client_credentials","authorization_code","password"],// Grant type to use
};


export const ftpTemplate = {
    "connectionName": "FTP Connection",
    "host": "ftp.hostname.com",
    "port": 21,
    "protocol": "FTP",
    "retryInterval": 0,
    "retryAttempts": 0,
    "authenticationType": "basicAuth", // or "anonymous"
    "userName": "User Name",
    "password": "password",
    "remotePath": "/remote/path",
    "secure": false, // Set to true for FTPS
    "passive": true, // Use passive mode if needed
    "timeout": 30000 // Timeout in milliseconds
};
export const kafkaTemplate = {
    "connectionName": "Kfka Connection",
    "brokers": "broker1:9092", // List of Kafka brokers
    "protocol": "SASL_SSL", // Options can be PLAINTEXT, SSL, SASL_PLAINTEXT, SASL_SSL
    "retryInterval": 0,
    "retryAttempts": 0,
    "authenticationType": "SASL_PLAIN", // Options can be PLAIN, SCRAM-SHA-256, SCRAM-SHA-512, OAUTHBEARER
    "topic": "your-topic",
    "groupId": "your-group-id", // Consumer group ID
    "clientId": "your-client-id",
    "securityProtocol": "SASL_SSL", // Options can be PLAINTEXT, SSL, SASL_PLAINTEXT, SASL_SSL
    "saslMechanism": "PLAIN", // Options can be PLAIN, SCRAM-SHA-256, SCRAM-SHA-512, OAUTHBEARER
    "saslUsername": "your-username",
    "saslPassword": "your-password",
    "schemaRegistryUrl": "https://schema-registry:8081", // URL of the schema registry
    "schemaRegistryUser": "your-schema-registry-username",
    "schemaRegistryPassword": "your-schema-registry-password"
};
export const sftpTemplate = {
    "connectionName": "SFTP Connection",
    "host": "sftp.hostname.com",
    "port": 22,
    "protocol": "SFTP",
    "retryInterval": 0,
    "retryAttempts": 0,
    "authenticationType": "password", // or "key"
    "userName": "User Name",
    "password": "password", // Only if using password authentication
    "privateKey": "/path/to/private/key", // Only if using key authentication
    "passphrase": "passphrase", // Only if the private key has a passphrase
    "remotePath": "/remote/path",
    "localPath": "/local/path",
    "secure": true, // SFTP is inherently secure
    "timeout": 30000, // Timeout in milliseconds
    "knownHosts": "/path/to/known/hosts", // Optional path to known hosts file
    "keepAliveInterval": 10000 // Interval in milliseconds to send keep-alive packets
};
export const websocketTemplate = {
    "connectionName": "Websocket Connection",
    "host": "wss://hostname",
    "port": 443,
    "protocol": "WebSocket",
    "retryInterval": 5000,
    "retryAttempts": 3,
    "basePath": "/basepath",
    "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer your_token_here" // If authentication is required
    },
    "secure": true, // Set to true for wss (WebSocket Secure)
    "keepAliveInterval": 30000, // Interval in milliseconds to send keep-alive messages
    "subProtocols": ["protocol1", "protocol2"], // Array of sub-protocols
    "pingInterval": 10000, // Interval in milliseconds to send ping messages
    "reconnectOnClose": true, // Automatically try to reconnect on connection close
    "messageFormat": "json", // Format of the messages (json, text, binary)
    "timeout": 60000 // Timeout in milliseconds
};

export const partnerFinanceGroupSE = {
  "connectionId": "FiN-GRP-SE",
  "connectionName": "Finance Group(Inkasso)",
  "environment": ["Test", "Production"],
  "apiDriveKey" : "drive-key",
  "apiDriveSecret" : "drive-secret",
  "apiSyncKey" : "sync-key",
  "apiSyncSecret" : "sync-secret",
};


export const mqttTemplate = {
  "connectionName": "MQTT Connection",
  "host": "mqtt.hostname.com",
  "port": 1883, // Default port for MQTT is 1883, or 8883 for secure (SSL/TLS)
  "protocol": "MQTT", // Could be "MQTT" or "MQTTS" (for secure connection)
  "retryInterval": 5000, // Retry interval in milliseconds
  "retryAttempts": 3, // Number of retry attempts before failing
  "authenticationType": "basicAuth", // Options: "basicAuth", "certificate", or "none"
  "userName": "User Name", // For basic authentication
  "password": "password", // For basic authentication
  "clientId": "mqtt-client-id", // Unique ID for the MQTT client
  "keepAliveInterval": 60, // Keep-alive interval in seconds
  "cleanSession": true, // Set to true to clear the session on disconnect
  "topic": "/topic/path", // The topic to subscribe or publish to
  "qos": 1, // Quality of Service level: 0 (at most once), 1 (at least once), 2 (exactly once)
  "retain": false, // Retain messages or not
  "secure": false, // Set to true for MQTTS (secure)
  "timeout": 30000 // Timeout in milliseconds for connection attempts
};




