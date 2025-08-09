import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const PhotoUploadScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    console.log('Gallery picker called');
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        Alert.alert('Success', 'Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Gallery pick error:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const pickImageFromComputer = async () => {
    console.log('Computer picker called');
    try {
      console.log('Starting document picker...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('Document picker result:', result);

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        setSelectedImage(imageUri);
        Alert.alert('Success', 'Image uploaded successfully!');
      } else if (result.canceled) {
        console.log('User canceled document picker');
      } else {
        console.log('No assets found in result');
        Alert.alert('Error', 'No image was selected');
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', `Failed to pick image from computer: ${error}`);
    }
  };

  const handleUploadPress = () => {
    console.log('Upload button pressed');
    console.log('Platform:', Platform.OS);
    
    // For testing, let's try the computer picker directly
    if (Platform.OS === 'web') {
      console.log('Web platform detected, calling computer picker directly');
      pickImageFromComputer();
    } else {
      // On mobile, show both options
      Alert.alert(
        'Upload Image',
        'Choose where to upload from:',
        [
          {
            text: 'From Device',
            onPress: () => {
              console.log('Device option selected');
              pickImageFromGallery();
            },
          },
          {
            text: 'From Computer',
            onPress: () => {
              console.log('Computer option selected');
              pickImageFromComputer();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleBack = () => {
    navigation.navigate('Welcome');
  };

  const handleNext = () => {
    console.log('🚀 Next button pressed, selectedImage:', selectedImage);
    if (selectedImage) {
      console.log('✅ Image exists, navigating to StyleSelection screen with params:', {
        imageUri: selectedImage,
        keepBackground: false
      });
      navigation.navigate('StyleSelection', {
        imageUri: selectedImage,
        keepBackground: false
      });
    } else {
      console.log('No image selected, showing message');
      setShowMessage(true);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Fade out and hide after 2 seconds
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowMessage(false);
        });
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Upload Your Photo</Text>
        
        {/* Upload Area - Smaller and more minimalist */}
        <TouchableOpacity style={styles.uploadArea} onPress={handleUploadPress}>
          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Text style={styles.imagePreviewText}>✓ Image Selected</Text>
            </View>
          ) : (
            <View style={styles.uploadIconContainer}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Message Display */}
        {showMessage && (
          <Animated.View 
            style={[
              styles.messageContainer,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.messageText}>You haven't selected an image yet!</Text>
          </Animated.View>
        )}

        {/* Navigation Controls - Positioned at bottom half */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, selectedImage && styles.navButtonActive]} 
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, selectedImage && styles.navButtonTextActive]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF69B4', // Vibrant pink background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  uploadArea: {
    width: width * 0.4, // Much smaller - reduced from 0.6 to 0.4
    height: width * 0.4, // Much smaller - reduced from 0.6 to 0.4
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  uploadIconContainer: {
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 40, // Smaller icon
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  imagePreview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    marginTop: 60,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },
  navButtonActive: {
    backgroundColor: '#FFF',
  },
  navButtonText: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: 'bold',
  },
  navButtonTextActive: {
    color: '#FF69B4',
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  messageText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default PhotoUploadScreen; 