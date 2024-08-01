import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import TabNavigator from './TabNavigator';
import {StatusBar} from 'react-native';
import {DrawerContent} from '../components';
import DrawerNavigator from './DrawerNavigator';
import {TermsScreen} from '../screen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Main">
        <Stack.Screen name="Auth" component={StackNavigator} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
