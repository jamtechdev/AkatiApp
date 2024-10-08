import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';

function Badge({title, onPress, isActive = false, style}) {
  return (
    <TouchableOpacity
      style={[
        styles.badgeText,
        style,
        isActive
          ? {
              backgroundColor: Colors.secondary,
            }
          : {},
      ]}
      onPress={onPress}>
      <Text style={{color: Colors.white, fontSize: 12}}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badgeText: {
    padding: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.tertiary,
    borderRadius: 5,
    color: Colors.white,
  },
});

export default Badge;
