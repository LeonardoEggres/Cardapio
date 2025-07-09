// frontend/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';  // Importa a tela de registro
import StudentMenuScreen from '../screens/StudentMenuScreen';
import NutricionistDashboardScreen from '../screens/NutricionistDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentMenu" component={StudentMenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NutricionistDashboard" component={NutricionistDashboardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
