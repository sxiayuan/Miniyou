#!/bin/bash

# MiniYouApp Development Starter Script (Local Expo CLI)

echo "🐻 Starting MiniYouApp Development Server..."
echo ""

# Clear any existing processes
pkill -f "expo" 2>/dev/null || true

# Clear Expo cache
echo "🧹 Clearing Expo cache..."
rm -rf .expo 2>/dev/null || true

# Start development server using local Expo CLI
echo "🚀 Starting development server with local Expo CLI..."
echo ""
echo "📱 Your app will open in iOS Simulator"
echo "📱 Or scan QR code with Expo Go app on your phone"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use local Expo CLI to avoid global CLI issues
npx expo start --clear --ios 