import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('PhotoUpload' as never);
  };

  const handleShowTutorial = () => {
    // TODO: Implement tutorial functionality
    console.log('Show tutorial pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Title */}
        <Text style={styles.title}>MiniYouApp</Text>
        <Text style={styles.subtitle}>
          Transform yourself into amazing mini figures with AI
        </Text>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Show Tutorial Button */}
          <TouchableOpacity style={styles.tutorialButton} onPress={handleShowTutorial}>
            <Text style={styles.tutorialButtonText}>Show Tutorial</Text>
          </TouchableOpacity>

          {/* Get Started Button */}
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_PURPLE,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.SECONDARY_TEXT,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 80,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  tutorialButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_PURPLE,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: COLORS.PRIMARY_PURPLE,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tutorialButtonText: {
    color: COLORS.PRIMARY_PURPLE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: COLORS.PRIMARY_PURPLE,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: COLORS.PRIMARY_PURPLE,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen; 