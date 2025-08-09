import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Welcome' as never);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#AF52DE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Teddy Bear */}
        <View style={styles.bearContainer}>
          <View style={styles.bear}>
            {/* Bear Head */}
            <View style={styles.bearHead}>
              {/* Ears */}
              <View style={styles.ear} />
              <View style={[styles.ear, styles.earRight]} />
              
              {/* Face */}
              <View style={styles.face}>
                {/* Eyes */}
                <View style={styles.eye} />
                <View style={[styles.eye, styles.eyeRight]} />
                
                {/* Nose */}
                <View style={styles.nose} />
                
                {/* Muzzle */}
                <View style={styles.muzzle} />
              </View>
            </View>
            
            {/* Body */}
            <View style={styles.body}>
              {/* Arms */}
              <View style={styles.arm} />
              <View style={[styles.arm, styles.armRight]} />
              
              {/* Legs */}
              <View style={styles.leg} />
              <View style={[styles.leg, styles.legRight]} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bearContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bear: {
    alignItems: 'center',
  },
  bearHead: {
    position: 'relative',
    width: 80,
    height: 80,
    backgroundColor: '#D4A574',
    borderRadius: 40,
    marginBottom: 10,
  },
  ear: {
    position: 'absolute',
    top: -5,
    left: 10,
    width: 20,
    height: 20,
    backgroundColor: '#C19A6B',
    borderRadius: 10,
  },
  earRight: {
    left: 50,
  },
  face: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    position: 'absolute',
    top: 25,
    left: 20,
    width: 8,
    height: 8,
    backgroundColor: '#2C2C2C',
    borderRadius: 4,
  },
  eyeRight: {
    left: 52,
  },
  nose: {
    position: 'absolute',
    top: 35,
    width: 6,
    height: 6,
    backgroundColor: '#2C2C2C',
    borderRadius: 3,
  },
  muzzle: {
    position: 'absolute',
    bottom: 15,
    width: 30,
    height: 20,
    backgroundColor: '#E6D3B3',
    borderRadius: 15,
  },
  body: {
    position: 'relative',
    width: 70,
    height: 60,
    backgroundColor: '#D4A574',
    borderRadius: 35,
  },
  arm: {
    position: 'absolute',
    top: 10,
    left: -8,
    width: 16,
    height: 25,
    backgroundColor: '#C19A6B',
    borderRadius: 8,
  },
  armRight: {
    left: 62,
  },
  leg: {
    position: 'absolute',
    bottom: -5,
    left: 10,
    width: 18,
    height: 20,
    backgroundColor: '#C19A6B',
    borderRadius: 9,
  },
  legRight: {
    left: 42,
  },
});

export default SplashScreen; 