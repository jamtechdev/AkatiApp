/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import {TextInput, Text, StyleSheet} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';

const Input = ({
  name,
  control,
  placeholder,
  onChangeText,
  secureTextEntry = false,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
        <>
          <TextInput
            style={GlobalStyles.inputView}
            placeholderTextColor={Colors.darkGray}
            placeholder={placeholder}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            {...rest}
          />
          {error && <Text style={GlobalStyles.errorText}>{error.message}</Text>}
        </>
      )}
    />
  );
};

export default Input;
