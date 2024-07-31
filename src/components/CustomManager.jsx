import { View, Text } from 'react-native'
import React from 'react'
import {
    SafeAreaProvider,
  } from 'react-native-safe-area-context';
import PushController from '../_utils/pushNotification';
export default function LayoutManager({ children }) {
  return (
    <SafeAreaProvider>
              <PushController />
      {children}
    </SafeAreaProvider>
  )
}