/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';

const Button = ({title, onPress, gradient = true, style, textStyle}) => {
  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} style={GlobalStyles.btnTouchable}>
        <LinearGradient
          colors={['rgba(255, 81, 47, 1)', 'rgba(221, 36, 118, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[GlobalStyles.btnPrimary, style]}>
          <Text style={[GlobalStyles.textWhite, styles.buttonText, textStyle]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[GlobalStyles.btnPrimary, style]}>
      <Text style={[GlobalStyles.textWhite, styles.buttonText,textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
});

export default Button;
