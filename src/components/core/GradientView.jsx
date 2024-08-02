import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function GradientView({
  children,
  style,
  onPress = () => console.log('hii'),
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['rgba(255, 81, 47, 1)', 'rgba(221, 36, 118, 1)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[style]}>
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}
