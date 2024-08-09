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
import {BookDetailsScreen, PrivacyScreen, TermsScreen} from '../screen';
import {useSelector} from 'react-redux';
import {getAuth} from '../_store/_reducers/auth';
import NotificationScreen from '../screen/notificationScreen';
import ProfileScreen from '../screen/profileScreen';
import ReadingScreen from '../screen/readingScreen';
import CinetPaymentScreen from '../screen/cinetPaymentScreen';
import paypalPayment from '../screen/paypalPayment';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {loggedIn, token} = useSelector(getAuth);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({navigation, route}) => ({
          header: () => (
            <CustomHeader title={''} navigation={navigation} showBack={true} />
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
        <Stack.Screen name="notification" component={NotificationScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen
          name="BookDetails"
          component={BookDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Reading"
          component={ReadingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CinetPaymentScreen"
          component={CinetPaymentScreen}
        />
        <Stack.Screen name="PayPalPaymentScreen" component={paypalPayment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
