import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;
type StyleSelectionRouteProp = RouteProp<RootStackParamList, 'StyleSelection'>;

const StyleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<StyleSelectionRouteProp>();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Get the image URI from route params (with defaults)
  const { imageUri = '', keepBackground = false } = route.params || {};

  console.log('StyleSelectionScreen rendering...');
  console.log('Selected style:', selectedStyle);
  console.log('🖼️ Image URI from params:', imageUri);
  console.log('🎨 Keep background:', keepBackground);

  const styleOptions = [
    { id: 'pixel', name: 'Pixel Art', description: '8-bit retro style' },
    { id: 'cartoon', name: 'Cartoon', description: 'Classic animated' },
    { id: 'cute', name: 'Cute', description: 'Kawaii chibi' },
    { id: 'sketch', name: 'Sketch', description: 'Hand-drawn' },
  ];

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleBack = () => {
    navigation.navigate('PhotoUpload');
  };

  const handleNext = () => {
    console.log('🚀 handleNext called');
    console.log('📊 Current state:');
    console.log('  selectedStyle:', selectedStyle);
    console.log('  imageUri:', imageUri);
    console.log('  keepBackground:', keepBackground);
    
    if (selectedStyle) {
      console.log('✅ Style selected, attempting navigation...');
      
      // Validate imageUri before navigation
      if (!imageUri || imageUri.trim() === '') {
        console.error('❌ No imageUri provided!');
        Alert.alert('Error', 'No image was uploaded. Please go back and upload an image first.');
        return;
      }
      
      try {
        console.log('🎯 Navigating to Loading screen with params:', {
          imageUri,
          style: selectedStyle,
          keepBackground
        });
        
        // Test simple navigation first
        console.log('🧪 Testing navigation...');
        
        navigation.navigate('Loading', {
          imageUri: imageUri,
          style: selectedStyle,
          keepBackground: keepBackground
        });
        
        console.log('✅ Navigation call completed');
      } catch (error) {
        console.error('❌ Navigation error:', error);
        Alert.alert('Navigation Error', `Failed to navigate: ${error}`);
      }
    } else {
      console.log('❌ No style selected');
      Alert.alert('No Style Selected', 'Please choose a style first');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Choose Your Style</Text>
        
        {/* Style Selection Grid */}
        <View style={styles.stylesContainer}>
          {styleOptions.map((style, index) => (
            <TouchableOpacity
              key={style.id}
              style={[
                styles.styleBox,
                selectedStyle === style.id && styles.selectedStyleBox
              ]}
              onPress={() => handleStyleSelect(style.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.styleName}>{style.name}</Text>
              <Text style={styles.styleDescription}>{style.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.navButton} onPress={handleBack}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, selectedStyle && styles.navButtonActive]} 
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={[styles.navButtonText, selectedStyle && styles.navButtonTextActive]}>›</Text>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 100, // Space for navigation
    position: 'relative',
  },
  title: {
    fontSize: Math.min(28, width * 0.07), // Responsive font size
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: height * 0.03, // Responsive margin
    textAlign: 'center',
  },
  stylesContainer: {
    width: width > 600 ? '60%' : '85%', // Wider on small screens
    justifyContent: 'center',
    gap: Math.min(12, height * 0.015), // Responsive gap
    alignSelf: 'center',
    maxHeight: height * 0.6, // Maximum height
  },
  styleBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: Math.min(16, width * 0.04),
    paddingVertical: Math.min(12, height * 0.02),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: Math.min(8, height * 0.01),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: Math.min(70, height * 0.1), // Minimum height
  },
  selectedStyleBox: {
    borderColor: '#007AFF',
    borderWidth: 3,
    backgroundColor: '#FFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  styleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  styleDescription: {
    fontSize: 14,
    color: '#666',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.1, // Responsive padding
    position: 'absolute',
    bottom: Math.max(20, height * 0.05), // Responsive bottom position
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navButton: {
    width: Math.min(60, width * 0.15),
    height: Math.min(60, width * 0.15),
    borderRadius: Math.min(30, width * 0.075),
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  navButtonActive: {
    backgroundColor: '#FFF',
  },
  navButtonText: {
    fontSize: Math.min(36, width * 0.08),
    color: '#FFF',
    fontWeight: 'bold',
  },
  navButtonTextActive: {
    color: '#FF6B6B',
  },
});

export default StyleSelectionScreen; 