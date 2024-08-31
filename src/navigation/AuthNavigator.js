// src/navigation/StackNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen, SignupScreen, ForgotScreen, PublicBookScreen} from '../screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomHeader, CustomTabBar, PublicCustomTabBar } from '../components';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthNavigator = () => {
  // return (
  //   <Stack.Navigator
  //     screenOptions={{headerShown: false}}
  //     initialRouteName="login">
  //     <Stack.Screen name="login" component={LoginScreen} />
  //     <Stack.Screen name="signup" component={SignupScreen} />
  //     <Stack.Screen name="forgot" component={ForgotScreen} />
  //   </Stack.Navigator>
  // );
  return (
    <Tab.Navigator
      tabBar={props => <PublicCustomTabBar {...props} />}
      screenOptions={({ navigation, route }) => ({
        header: (props) => <CustomHeader {...props} title={route.name} navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={PublicBookScreen}
      />
      <Tab.Screen
        name="signIn"
        component={LoginScreen}
      />
      <Tab.Screen
        name="signUp"
        component={SignupScreen}
      />
      {/* <Tab.Screen
        name="Search"
        component={SearchScreen}
      /> */}
    </Tab.Navigator>
  );
};

export default AuthNavigator;
