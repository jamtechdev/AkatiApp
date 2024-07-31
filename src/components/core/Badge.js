import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Colors } from '../../_utils/GlobalStyle';

function Badge({text}) {
  return (
    <View style={styles.badgeText}>
      <Text style={{color:Colors.white, fontSize:12}}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    badgeText:{
        padding:8,
        paddingHorizontal:20,
        backgroundColor:Colors.tertiary,
        borderRadius:5,
        color:Colors.white,
    }
});

export default Badge;
