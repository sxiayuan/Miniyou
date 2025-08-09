#!/bin/bash

# MiniYouApp Setup Verification Script
# This script checks if your development environment is properly configured

echo "🔍 MiniYouApp Setup Verification"
echo "================================="

# Check if we're in the correct directory
echo ""
echo "📁 Checking directory structure..."

if [[ $(pwd) == *"miniyouapp"* ]]; then
    echo "✅ Correct directory - in miniyouapp folder"
else
    echo "❌ Wrong directory - should be in miniyouapp folder"
    echo "   Current directory: $(pwd)"
    echo "   Please navigate to the miniyouapp folder and run this script again"
    exit 1
fi

# Check if essential files exist
echo ""
echo "📄 Checking essential files..."

if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
    exit 1
fi

if [ -f "app.json" ]; then
    echo "✅ app.json found"
else
    echo "❌ app.json not found"
    exit 1
fi

if [ -f "App.tsx" ]; then
    echo "✅ App.tsx found"
else
    echo "❌ App.tsx not found"
    exit 1
fi

if [ -d "src" ]; then
    echo "✅ src directory found"
else
    echo "❌ src directory not found"
    exit 1
fi

# Check package.json configuration
echo ""
echo "📦 Checking package.json configuration..."

if grep -q '"name": "miniyouapp"' package.json; then
    echo "✅ Package name is correct: miniyouapp"
else
    echo "❌ Package name is incorrect"
    echo "   Expected: miniyouapp"
    echo "   Found: $(grep '"name"' package.json)"
fi

# Check app.json configuration
echo ""
echo "⚙️ Checking app.json configuration..."

if grep -q '"bundleIdentifier": "com.miniyouapp.app"' app.json; then
    echo "✅ Bundle identifier is correct: com.miniyouapp.app"
else
    echo "❌ Bundle identifier is incorrect"
    echo "   Expected: com.miniyouapp.app"
fi

# Check if node_modules exists
echo ""
echo "📚 Checking dependencies..."

if [ -d "node_modules" ]; then
    echo "✅ node_modules directory found"
else
    echo "❌ node_modules directory not found"
    echo "   Run: npm install"
    exit 1
fi

# Check if Expo CLI is available
echo ""
echo "🛠️ Checking development tools..."

if command -v npx &> /dev/null; then
    echo "✅ npx is available"
else
    echo "❌ npx is not available"
    echo "   Install Node.js and npm"
    exit 1
fi

# Check TypeScript compilation
echo ""
echo "🔧 Checking TypeScript compilation..."

if npx tsc --noEmit 2>/dev/null; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    echo "   Run: npx tsc --noEmit"
    echo "   Fix any type errors before proceeding"
fi

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."

if [ -f ".env" ]; then
    echo "✅ .env file found"
    if grep -q "EXPO_PUBLIC_OPENAI_API_KEY" .env; then
        echo "✅ OpenAI API key found in .env"
    else
        echo "⚠️ OpenAI API key not found in .env"
        echo "   Add: EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here"
    fi
else
    echo "⚠️ .env file not found"
    echo "   Create .env file with: EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here"
fi

# Check iOS development environment
echo ""
echo "📱 Checking iOS development environment..."

if command -v xcode-select &> /dev/null; then
    if xcode-select -p &> /dev/null; then
        echo "✅ Xcode command line tools installed"
    else
        echo "❌ Xcode command line tools not installed"
        echo "   Run: xcode-select --install"
    fi
else
    echo "❌ Xcode not found"
    echo "   Install Xcode from the App Store"
fi

# Check if iOS Simulator is available
if command -v xcrun &> /dev/null; then
    if xcrun simctl list devices &> /dev/null; then
        echo "✅ iOS Simulator available"
    else
        echo "❌ iOS Simulator not available"
        echo "   Install Xcode and iOS Simulator"
    fi
else
    echo "❌ iOS Simulator not available"
fi

# Final summary
echo ""
echo "🎉 Setup Verification Complete!"
echo "================================"

echo ""
echo "🚀 To start development:"
echo "   npm start"
echo ""
echo "📱 To run on iOS:"
echo "   npm run ios"
echo ""
echo "🌐 To run on web:"
echo "   npm run web"
echo ""

echo "📚 For more information, see:"
echo "   - README.md"
echo "   - DEVELOPMENT_PLAN.md"
echo "   - TROUBLESHOOTING.md"
echo ""

echo "🐻 Happy coding with MiniYouApp!" 