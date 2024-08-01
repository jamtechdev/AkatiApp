import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import logo from '../images/logo.png';
import {Colors} from '../_utils/GlobalStyle';
const DrawerContent = (props, {navigation}) => {
  return (
    <DrawerContentScrollView
      {...props}
      style={{backgroundColor: Colors.tertiary}}>
      <View style={styles.drawerHeader}>
        <Image
          source={logo} // Replace with your own image URL
          style={styles.profileImage}
        />
        <Text style={styles.drawerTitle}>My App</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Help"
        onPress={() => props.navigation.navigate('Settings')} // Navigate to Settings screen
      />
      {/* Add more custom drawer items here */}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    // padding: 20,
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: Colors.white,
  },
  profileImage: {
    width: 80,
    height: 80,
    // borderRadius: 40,
    marginBottom: 10,
  },
});

export default DrawerContent;
