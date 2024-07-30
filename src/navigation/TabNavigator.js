import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LibraryScreen, DiscoverScreen} from '../screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomTabBar } from '../components';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
