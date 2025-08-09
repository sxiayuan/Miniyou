# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```bash
# OpenAI API Configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Optional: App Configuration
EXPO_PUBLIC_APP_NAME=MiniYouApp
EXPO_PUBLIC_APP_VERSION=1.0.0

# Optional: Development Settings
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_API_TIMEOUT=30000
```

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Give it a name (e.g., "MiniYouApp")
6. Copy the generated key
7. Paste it in your `.env` file

## Important Notes

- **Never commit your `.env` file** to version control
- The `.env` file is already in `.gitignore`
- All environment variables must start with `EXPO_PUBLIC_` to be accessible in the app
- Restart the development server after adding environment variables

## Testing Your Setup

Once you've added your API key, you can test it by:

1. Restart the development server: `npm start`
2. Navigate to the app
3. Try uploading a photo and generating an image

## Troubleshooting

If you get API errors:
- Check that your API key is correct
- Ensure you have credits in your OpenAI account
- Verify the key has the necessary permissions
- Check the OpenAI API status page for any outages 