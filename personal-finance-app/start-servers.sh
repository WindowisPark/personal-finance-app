#!/bin/bash

# Kill any existing Node processes
pkill -f node

# Start backend in background
cd /home/pch/personal-finance-app/personal-finance-app/backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd /home/pch/personal-finance-app/personal-finance-app/frontend
npm start &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend running on: http://localhost:8000"
echo "Frontend running on: http://localhost:3000"

# Wait for both processes
wait