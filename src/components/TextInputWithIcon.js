import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome'; // You can replace FontAwesome with any other icon library you're using
import {Colors} from '../_utils/GlobalStyle';
import { GradientView } from '.';

const TextInputWithIcon = ({
  iconName,
  iconSize = 20,
  iconColor = Colors.white,
  placeholder = '',
  value,
  onChangeText,
  secureTextEntry = false,
  onIconPress,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
      <GradientView style={styles.Icons}>
      <TouchableOpacity onPress={onIconPress} style={styles.Icons}>
        <Icons name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
      </GradientView>
    </View>
  );
};

export default TextInputWithIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 50,
    padding: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: '#fff',
  },
  Icons: {
    // backgroundColor: Colors.secondary,
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent:'center',
    alignItems:'center',
  },
});
