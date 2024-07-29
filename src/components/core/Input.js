import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import GlobalStyles, { Colors } from '../../_utils/GlobalStyle';


const Input = ({ placeholder, onChangeText, secureTextEntry = false }) => {
    return (
        <TextInput
            style={GlobalStyles.inputView}
            placeholderTextColor={Colors.darkGray}
            placeholder={placeholder}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
        />
    );
};

export default Input;
