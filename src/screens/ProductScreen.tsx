import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Share,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;
type ProductRouteProp = RouteProp<RootStackParamList, 'Product'>;

const ProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProductRouteProp>();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get the parameters from route
  const { originalImageUri, generatedImageBase64, style } = route.params;

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my ${style} style transformation created with MiniYou! 🎨`,
        url: `data:image/png;base64,${generatedImageBase64}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleDownload = () => {
    // For web, this will trigger a download
    // For mobile, we'd need to save to photo library
    Alert.alert('Download', 'Image download functionality would be implemented here');
  };

  const handleTryAgain = () => {
    navigation.navigate('StyleSelection', {
      imageUri: originalImageUri,
      keepBackground: false
    });
  };

  const handleNewPhoto = () => {
    navigation.navigate('PhotoUpload');
  };

  const handleGoHome = () => {
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your {style} Style! 🎨</Text>
          <Text style={styles.subtitle}>AI-generated masterpiece</Text>
        </View>

        {/* Image Comparison */}
        <View style={styles.imageContainer}>
          {/* Original Image */}
          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>Original</Text>
            <Image 
              source={{ uri: originalImageUri }} 
              style={styles.comparisonImage}
              resizeMode="cover"
            />
          </View>

          {/* Generated Image */}
          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>AI Generated</Text>
            <View style={styles.generatedImageContainer}>
              <Image 
                source={{ uri: `data:image/png;base64,${generatedImageBase64}` }}
                style={styles.comparisonImage}
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <View style={styles.imageLoadingOverlay}>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <View style={styles.primaryActions}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Text style={styles.downloadButtonText}>💾 Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
              <Text style={styles.tryAgainButtonText}>🎨 Try Another Style</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.newPhotoButton} onPress={handleNewPhoto}>
              <Text style={styles.newPhotoButtonText}>📸 New Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Text style={styles.homeButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF69B4', // Vibrant pink background matching other screens
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Extra padding to ensure scrolling works
    minHeight: height + 200, // Ensure content is taller than screen
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  comparisonImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  generatedImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    marginBottom: 20,
  },
  primaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 15,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  tryAgainButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tryAgainButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  newPhotoButton: {
    flex: 1,
    backgroundColor: '#9C27B0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  newPhotoButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationContainer: {
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductScreen;