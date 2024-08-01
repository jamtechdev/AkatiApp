// src/navigation/StackNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen, SignupScreen, ForgotScreen, TermsScreen} from '../screen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignupScreen} />
      <Stack.Screen name="forgot" component={ForgotScreen} />
      <Stack.Screen name="terms" component={TermsScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
