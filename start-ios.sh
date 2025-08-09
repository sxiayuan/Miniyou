#!/bin/bash

# MiniYouApp iOS Development Starter Script

echo "🐻 Starting MiniYouApp iOS Development Server..."
echo ""

# Clear any existing processes
pkill -f "expo" 2>/dev/null || true

# Clear Expo cache
echo "🧹 Clearing Expo cache..."
rm -rf .expo 2>/dev/null || true

# Start iOS development server
echo "🚀 Starting iOS development server..."
echo ""
echo "📱 Your app will open in iOS Simulator"
echo "📱 Or scan QR code with Expo Go app on your phone"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npx expo start --clear --ios 