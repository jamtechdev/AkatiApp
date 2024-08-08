import {View, Text} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../_utils/GlobalStyle';
export default function NoDataFound({description}) {
  return (
    <View
      style={{
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: Colors.black,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center',
        gap: 20,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <MaterialIcons
          name={'error-outline'}
          size={45}
          color={Colors.secondary}
        />
      </View>
      <Text
        style={{color: Colors.white, textAlign: 'center', color: Colors.gray}}>
       {description || 'No data found'}
      </Text>
    </View>
  );
}
