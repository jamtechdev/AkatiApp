import React from 'react'
import {View, Text} from 'react-native'
import GlobalStyles from '../_utils/GlobalStyle'

export default function Divider({title}) {
  return (
    <View
      style={{
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
      }}>
      <Text style={[GlobalStyles.divider]}></Text>
      <Text
        style={[GlobalStyles.textWhite, {fontSize: 14, textAlign: 'center'}]}>
        {title}{' '}
      </Text>
      <Text style={[GlobalStyles.divider]}></Text>
    </View>
  )
}
