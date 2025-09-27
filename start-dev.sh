#!/bin/bash

# Kill any existing Next.js dev servers
echo "Stopping existing Next.js dev servers..."
pkill -f "next dev"

# Wait a moment for processes to stop
sleep 2

# Start development server on port 3005
echo "Starting development server on port 3005..."
PORT=3005 npm run dev