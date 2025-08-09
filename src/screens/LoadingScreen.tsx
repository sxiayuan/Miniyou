import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import img2imgService from '../services/img2imgService';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;
type LoadingRouteProp = RouteProp<RootStackParamList, 'Loading'>;

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LoadingRouteProp>();
  const [loadingMessage, setLoadingMessage] = useState('Loading the magic');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('Initializing...');
  const progressAnim = useState(new Animated.Value(0))[0];
  
  // Get the parameters from route
  const { imageUri, style, keepBackground } = route.params || {};

  console.log('🎬 LoadingScreen received params:');
  console.log('  📸 imageUri:', imageUri);
  console.log('  🎨 style:', style);
  console.log('  🖼️ keepBackground:', keepBackground);
  console.log('  🔍 route.params:', route.params);

  // Validate required parameters (imageUri is optional for text-to-image mode)
  if (!style) {
    console.error('❌ Missing required style parameter:', { imageUri, style });
    Alert.alert('Error', 'Missing style selection for image generation');
    navigation.goBack();
    return null;
  }
  
  // Log warning if no imageUri (expected for text-to-image mode)
  if (!imageUri) {
    console.log('⚠️ No imageUri provided - using text-to-image mode');
  }

  // Progress simulation function
  const updateProgress = (newProgress: number, stage: string, message: string) => {
    setProgress(newProgress);
    setProgressStage(stage);
    setLoadingMessage(message);
    
    Animated.timing(progressAnim, {
      toValue: newProgress / 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const generateImage = async () => {
      try {
        // Stage 1: Connection (0-10%)
        updateProgress(0, 'Connecting...', 'Connecting to AI...');
        
        const isConnected = await img2imgService.testConnection();
        if (!isConnected) {
          Alert.alert('Error', 'Could not connect to ComfyUI. Please make sure it is running.');
          navigation.goBack();
          return;
        }
        
        updateProgress(10, 'Connected ✓', 'Connected to AI successfully!');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Stage 2: Image preparation (10-25%) - temporarily skipped
        updateProgress(15, 'Processing...', 'Preparing style prompt...');
        
        // Skip image conversion for now (using text-to-image)
        const imageBase64 = ""; // Placeholder
        updateProgress(25, 'Style Ready ✓', 'Style prompt prepared!');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Stage 3: Model loading (25-40%)
        updateProgress(30, 'Loading Models...', 'Loading AI models...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateProgress(40, 'Models Loaded ✓', 'AI models ready!');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Stage 4: Generation start (40-50%)
        updateProgress(45, 'Starting Generation...', `Creating ${style} style...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        updateProgress(50, 'Generating...', 'AI is working its magic...');

        // Stage 5: Actual generation with progress simulation
        const startTime = Date.now();
        
        // Start progress simulation
        const simulateProgress = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const estimatedTotal = 30000; // 30 seconds estimated for simplified workflow
          const progressPercent = Math.min(50 + (elapsed / estimatedTotal) * 40, 90);
          
          if (progressPercent < 60) {
            updateProgress(progressPercent, 'Encoding...', 'Processing your image...');
          } else if (progressPercent < 70) {
            updateProgress(progressPercent, 'Styling...', `Applying ${style} effects...`);
          } else if (progressPercent < 80) {
            updateProgress(progressPercent, 'Refining...', 'Enhancing details...');
          } else {
            updateProgress(progressPercent, 'Finalizing...', 'Almost done...');
          }
        }, 200);

        let result;
        try {
          result = await img2imgService.generateImg2Img({
            imageBase64,
            style,
            strength: 0.75
          });
        } catch (error) {
          clearInterval(simulateProgress);
          console.error('Generation failed:', error);
          Alert.alert('Generation Failed', 'The AI model encountered an error. This might be due to memory constraints or model issues.', [
            {
              text: 'Try Again',
              onPress: () => navigation.goBack()
            }
          ]);
          return;
        }
        
        clearInterval(simulateProgress);

        if (result.success && result.imageBase64) {
          // Stage 6: Complete (90-100%)
          updateProgress(95, 'Generated ✓', 'Image generated successfully!');
          setGeneratedImage(`data:image/png;base64,${result.imageBase64}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          updateProgress(100, 'Complete ✓', 'Your masterpiece is ready!');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          navigation.navigate('Product', {
            originalImageUri: imageUri,
            generatedImageBase64: result.imageBase64,
            style: style
          });
        } else {
          Alert.alert('Error', result.error || 'Failed to generate image', [
            {
              text: 'Try Again',
              onPress: () => navigation.goBack()
            }
          ]);
        }
      } catch (error) {
        console.error('Generation error:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      }
    };

    generateImage();
  }, [navigation, imageUri, style, keepBackground]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main loading message */}
        <Text style={styles.loadingText}>{loadingMessage}</Text>
        
        {/* Progress stage */}
        <Text style={styles.stageText}>{progressStage}</Text>
        
        {/* Progress bar container */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        
        {/* Generated image preview or loading animation */}
        {generatedImage ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>Preview:</Text>
            <Image source={{ uri: generatedImage }} style={styles.resultImage} />
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" style={styles.loadingSpinner} />
            <Text style={styles.loadingSubtext}>Creating your {style} style...</Text>
          </View>
        )}
        
        {/* Progress steps indicator */}
        <View style={styles.stepsContainer}>
          <View style={[styles.stepDot, progress >= 10 && styles.stepDotActive]}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <View style={[styles.stepLine, progress >= 25 && styles.stepLineActive]} />
          <View style={[styles.stepDot, progress >= 25 && styles.stepDotActive]}>
            <Text style={styles.stepText}>2</Text>
          </View>
          <View style={[styles.stepLine, progress >= 50 && styles.stepLineActive]} />
          <View style={[styles.stepDot, progress >= 50 && styles.stepDotActive]}>
            <Text style={styles.stepText}>3</Text>
          </View>
          <View style={[styles.stepLine, progress >= 90 && styles.stepLineActive]} />
          <View style={[styles.stepDot, progress >= 90 && styles.stepDotActive]}>
            <Text style={styles.stepText}>4</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF69B4', // Vibrant pink background matching PhotoUploadScreen
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 60,
    height: 60,
  },
  resultImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  stageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  progressContainer: {
    width: '90%',
    marginBottom: 30,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepLineActive: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default LoadingScreen; 