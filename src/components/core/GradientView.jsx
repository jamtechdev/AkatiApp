import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function GradientView({
  children,
  style,
  gradient = true,
  onPress = () => console.log('hii'),
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        style,
        {
          paddingHorizontal: 0,
          paddingVertical: 0,
          margin: 0,
          padding: 0,
          marginHorizontal: 0,
          marginVertical: 0,
        },
      ]}>
      {gradient ?
        <LinearGradient
        colors={['rgba(255, 81, 47, 1)', 'rgba(221, 36, 118, 1)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[style]}>
        {children}
      </LinearGradient>
      :
      <LinearGradient
        colors={['#fff', '#fff']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[style]}>
        {children}
      </LinearGradient>
      }
    </TouchableOpacity>
  );
}
