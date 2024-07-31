import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LibraryScreen, DiscoverScreen, SearchScreen} from '../screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CustomHeader, CustomTabBar} from '../components';
import DrawerNavigator from './DrawerNavigator'; // Import the drawer navigator

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={DiscoverScreen}
        options={{
          header: () => <CustomHeader title="Home" />,
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          header: () => <CustomHeader title="Library" />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          header: () => <CustomHeader title="Search" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
