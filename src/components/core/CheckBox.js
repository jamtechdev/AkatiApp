/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles, { Colors } from '../../_utils/GlobalStyle';

const Checkbox = ({ label, checked, onChange, labelStyle, containerStyle }) => {
    return (
        <TouchableOpacity onPress={onChange} style={[styles.container, containerStyle]}>
            <Icon name={checked ? 'checkbox' : 'square-outline'} size={20} color={Colors.secondary} />
            <Text style={[GlobalStyles.textWhite, styles.label, labelStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
        color: Colors.gray,
        fontWeight: '500',
    },
});

export default Checkbox;
