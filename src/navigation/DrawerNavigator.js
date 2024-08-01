// src/navigation/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SettingsScreen, ReviewScreen, SearchScreen} from '../screen'; // Add your drawer screens here
import {DrawerContent} from '../components';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    // screenOptions={{
    //   headerShown: false,
    //   drawerPosition: 'left',
    //   drawerType: 'front',
    // }}
    // drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Review" component={ReviewScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
