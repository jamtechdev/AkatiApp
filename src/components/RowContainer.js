/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles, { Colors } from '../_utils/GlobalStyle';

// create a component
const RowContainer = ({ children, style }) => {
    return (
        <View
            style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
            }, style]}>
                {children}
        </View>
    );
};

export default RowContainer;
