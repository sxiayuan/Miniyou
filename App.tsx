import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { COLORS } from './src/constants/colors';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PhotoUploadScreen from './src/screens/PhotoUploadScreen';
import StyleSelectionScreen from './src/screens/StyleSelectionScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ProductScreen from './src/screens/ProductScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={COLORS.PRIMARY_PURPLE} />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.PRIMARY_PURPLE,
            },
            headerTintColor: COLORS.WHITE,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: false, // We'll handle custom headers
          }}
        >
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PhotoUpload" 
            component={PhotoUploadScreen}
            options={{ title: 'Upload Photo' }}
          />
          <Stack.Screen 
            name="StyleSelection" 
            component={StyleSelectionScreen}
            options={{ title: 'Choose Style' }}
          />
          <Stack.Screen 
            name="Loading" 
            component={LoadingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Product" 
            component={ProductScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
