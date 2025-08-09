# MiniYouApp Troubleshooting Guide

## Common Issues and Solutions

### 1. Development Environment Issues

#### Issue: "Command not found: expo"
**Solution:**
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Or use npx
npx expo start
```

#### Issue: "Metro bundler not starting"
**Solution:**
```bash
# Clear Metro cache
npx expo start --clear

# Or reset cache completely
npx expo start -c
```

#### Issue: "TypeScript compilation errors"
**Solution:**
```bash
# Check TypeScript compilation
cd /Users/stephaniexia/Downloads/miniyou/miniyouapp
npx tsc --noEmit

# Fix any type errors before proceeding
```

### 2. iOS Development Issues

#### Issue: "iOS Simulator not launching"
**Solution:**
```bash
# Make sure Xcode is installed
xcode-select --install

# Open iOS Simulator manually
open -a Simulator

# Then run the app
npm run ios
```

#### Issue: "Build failed for iOS"
**Solution:**
```bash
# Clean and rebuild
cd /Users/stephaniexia/Downloads/miniyou/miniyouapp
npx expo run:ios --clear

# Or reset completely
rm -rf node_modules
npm install
npx expo run:ios
```

### 3. Android Development Issues

#### Issue: "Android emulator not found"
**Solution:**
```bash
# Install Android Studio
# Open AVD Manager and create a virtual device
# Then run:
npm run android
```

#### Issue: "ADB not found"
**Solution:**
```bash
# Add Android SDK to PATH
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 4. Web Development Issues

#### Issue: "Web build failing"
**Solution:**
```bash
# Install web dependencies
npx expo install react-native-web react-dom

# Start web development
npm run web
```

#### Issue: "Web assets not loading"
**Solution:**
```bash
# Clear web cache
npx expo start --web --clear

# Check if assets are in the correct location
ls -la assets/
```

### 5. API and Services Issues

#### Issue: "OpenAI API key not working"
**Solution:**
```bash
# Check environment variables
echo $EXPO_PUBLIC_OPENAI_API_KEY

# Make sure .env file exists
ls -la .env

# Restart development server after changing .env
npm start
```

#### Issue: "Image upload failing"
**Solution:**
```bash
# Check permissions in app.json
# Make sure camera and photo library permissions are set

# Test on physical device if simulator issues persist
```

### 6. Dependencies Issues

#### Issue: "Package not found"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Version conflicts"
**Solution:**
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Or update specific package
npm install package-name@latest
```

### 7. Build and Deployment Issues

#### Issue: "Production build failing"
**Solution:**
```bash
# Build for production
npx expo build:ios
npx expo build:android

# Or use EAS Build
npx eas build --platform ios
npx eas build --platform android
```

#### Issue: "App store submission rejected"
**Solution:**
- Check app.json configuration
- Verify bundle identifier matches
- Ensure all required permissions are documented
- Test on physical devices before submission

### 8. Performance Issues

#### Issue: "App is slow"
**Solution:**
```bash
# Enable performance monitoring
npx expo start --dev-client

# Check for memory leaks
# Use React DevTools for profiling
```

#### Issue: "Large bundle size"
**Solution:**
```bash
# Analyze bundle
npx expo export --dump-assetmap

# Remove unused dependencies
npm prune
```

### 9. Debugging Tips

#### Enable Debug Mode
```bash
# Start with debug mode
npx expo start --dev-client

# Use React Native Debugger
# Install from: https://github.com/jhen0409/react-native-debugger
```

#### Check Logs
```bash
# View Metro logs
npx expo start --verbose

# View device logs (iOS)
xcrun simctl spawn booted log stream --predicate 'process == "miniyouapp"'

# View device logs (Android)
adb logcat | grep "ReactNativeJS"
```

### 10. Environment Setup Verification

Run the verification script:
```bash
cd /Users/stephaniexia/Downloads/miniyou/miniyouapp
./verify-setup.sh
```

This will check:
- ✅ Correct directory structure
- ✅ All dependencies installed
- ✅ Configuration files present
- ✅ Environment variables set
- ✅ Development tools available

### 11. Getting Help

If you're still experiencing issues:

1. **Check the logs** - Look for specific error messages
2. **Search the documentation** - Expo and React Native docs
3. **Check GitHub issues** - Look for similar problems
4. **Ask the community** - Expo Discord or Stack Overflow
5. **Create a minimal reproduction** - Isolate the issue

### 12. Common Error Messages

#### "Module not found"
- Check import paths
- Verify file exists
- Clear Metro cache

#### "Permission denied"
- Check app.json permissions
- Test on physical device
- Verify iOS/Android settings

#### "Network request failed"
- Check internet connection
- Verify API endpoints
- Check CORS settings (web)

#### "Type error"
- Run TypeScript check
- Fix type definitions
- Update @types packages

---

**Remember**: Most issues can be resolved by clearing caches and restarting the development server! 