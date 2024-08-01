import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../_utils/GlobalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
const CustomHeader = ({title, hideDrawer,showBack, navigation}) => {
  return (
    <View style={styles.header}>
    {showBack && (
      <Ionicons name={'arrow-back'} size={22} color={'white'} onPress={()=> navigation.goBack()} />
    )}
      {hideDrawer && (
      <Ionicons name={'menu'} size={22} color={'white'} onPress={()=> navigation.toggleDrawer()} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Ionicons name={'notifications'} size={22} color={'white'} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.tertiary, // Adjust as needed
  },
  title: {
    fontSize: 20,
    color: 'white', // Adjust as needed
  },
});

export default CustomHeader;
