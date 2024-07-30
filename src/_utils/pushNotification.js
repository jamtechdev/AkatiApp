/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { PermissionsAndroid, Platform } from 'react-native';

const PushController = () => {
    useEffect(() => {
        (async () => {
            // await firebase.initializeApp(androidcredentials);
            if (Platform.OS !== 'ios') {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            }
            const permissions = await checkApplicationPermission();
            if (permissions) {
                messaging()
                    .getToken()
                    .then(token => {
                        console.log(token , "fcm token ")
                        AsyncStorage.setItem('firebaseToken', JSON.stringify(token));
                    });
            }
        })();
        return messaging().onTokenRefresh(token => {
            console.log('Refresh token', token);
        });
    }, []);
    async function checkApplicationPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            return true
        }
        return false

    }
    return null;
};
export default PushController;
