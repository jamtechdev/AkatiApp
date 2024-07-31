//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GlobalStyles, {Colors} from '../_utils/GlobalStyle';

// create a component
const ContainerCenter = ({children}) => {
  return (
    <View
      style={[
        GlobalStyles.globalContainer,
        {alignItems: 'center', justifyContent: 'center',},
      ]}>
      <View style={{width: '100%'}}>{children}</View>
    </View>
  );
};

export default ContainerCenter;
