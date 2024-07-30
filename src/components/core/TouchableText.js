import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';

const TouchableText = ({children, style, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: Colors.white,
  },
});

export default TouchableText;
