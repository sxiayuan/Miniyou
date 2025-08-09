# MiniYouApp

A React Native app that creates personalized mini avatars using AI image generation.

## Features

- 📸 Photo upload and camera capture
- 🎨 Multiple art style options (pixel, cartoon, cute, anime, etc.)
- 🤖 AI-powered image generation using OpenAI
- 💾 Save and share generated avatars
- 📱 Cross-platform (iOS & Android)

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **AI Integration**: OpenAI API
- **Image Processing**: Expo Image Manipulator
- **File System**: Expo File System
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd miniyouapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
miniyouapp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── services/           # API and business logic
│   ├── store/              # Redux store and slices
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Environment Setup

1. Create a `.env` file in the root directory
2. Add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@miniyouapp.com or create an issue in the repository. 