// src/navigation/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SettingsScreen, ReviewScreen} from '../screen'; // Add your drawer screens here
import { DrawerContent } from '../components';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false, drawerPosition:'right', drawerType:'front' }}  drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Screen name="HomeTabs" component={TabNavigator} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="Profile" component={ReviewScreen} />
  </Drawer.Navigator>
  );
};

export default DrawerNavigator;
