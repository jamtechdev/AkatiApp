// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SettingsScreen, ReviewScreen, SearchScreen } from '../screen'; // Add your drawer screens here
import { DrawerContent, CustomHeader } from '../components';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => <CustomHeader title={route.name} navigation={navigation} />,
        drawerPosition: 'left',
        drawerType: 'front',
      })}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Discover"
        component={TabNavigator}
        options={() => ({
          headerShown: false,
        })}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Review" component={ReviewScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
