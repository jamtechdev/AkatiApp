/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigator from './StackNavigator';
import TabNavigator from './TabNavigator';
import {StatusBar} from 'react-native';
import {CustomHeader, DrawerContent} from '../components';
import DrawerNavigator from './DrawerNavigator';
import {PrivacyScreen, TermsScreen} from '../screen';
import {useSelector} from 'react-redux';
import {getAuth} from '../_store/_reducers/auth';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {loggedIn, token} = useSelector(getAuth);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({navigation, route}) => ({
          header: () => (
            <CustomHeader
              title={route.name}
              navigation={navigation}
              showBack={true}
            />
          ),
        })}
        initialRouteName={loggedIn && token ? 'Main' : 'Auth'}>
        <Stack.Screen
          name="Auth"
          component={StackNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
