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
import LoginScreen from './src/screen/loginScreen';
import {store, persistor} from './src/_store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
// import PushController from './src/_utils/pushNotification';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="login" component={LoginScreen} />
              </Stack.Navigator>
              {/* <PushController /> */}
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
