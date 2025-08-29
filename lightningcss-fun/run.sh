#!/bin/bash

echo "Starting LightningCSS Application..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Node.js server with LightningCSS..."
echo "Open your browser to: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm start