/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ForgotScreen, LoginScreen, SignupScreen} from './src/screen';
import {store, persistor} from './src/_store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import PushController from './src/_utils/pushNotification';
import AppNavigator from './src/navigation';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
          <PushController />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <AppNavigator />
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
  );
}

export default App;
