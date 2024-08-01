// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LibraryScreen, DiscoverScreen, SearchScreen } from '../screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomHeader, CustomTabBar } from '../components';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ navigation, route }) => ({
        header: (props) => <CustomHeader {...props} title={route.name} navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={DiscoverScreen}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
