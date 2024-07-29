import React from 'react'
import {Text, StyleSheet} from 'react-native'
import GlobalStyles, { Colors } from '../../_utils/GlobalStyle'

const CustomText = ({children, style}) => {
  return <Text style={[styles.text, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: Colors.white,
  },
})

export default CustomText
