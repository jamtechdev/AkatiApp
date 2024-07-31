import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';

const HeadingText = ({children, style}) => {
  return (
    <View>
      <Text style={[styles.text, style]}>{children}</Text>
      <View style={[styles.line]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: 600,
    paddingVertical: 10,
  },
  line: {
    width: 60,
    height: 4,
    backgroundColor: Colors.secondary,
    borderRadius: 50,
  },
});

export default HeadingText;
