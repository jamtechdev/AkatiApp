import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';

const BackButton = () => {
  return (
    <View style={[styles.text]}>
      <Icon name={'arrow-back'} size={25} color={Colors.secondary} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton;
