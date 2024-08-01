/* eslint-disable prettier/prettier */
// src/components/DrawerContent.js
import React from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import logo from '../images/logo.png'
import {Colors} from '../_utils/GlobalStyle'

const DrawerContent = props => {
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
        <DrawerItem
        label='Discover'
        labelStyle={{color: Colors.white}}
        onPress={() => props.navigation.navigate('Discover')}
      />
          
      <DrawerItem
        label='Settings'
        labelStyle={{color: Colors.white}}
        onPress={() => props.navigation.navigate('Settings')}
      />
          <DrawerItem
        label='Review'
        labelStyle={{color: Colors.white}}
        onPress={() => props.navigation.navigate('Review')}
      />
          {/* <DrawerItem
        label='Logout'
        labelStyle={{color: Colors.white}}
        onPress={() => props.navigation.navigate('Settings')}
      /> */}
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
})

export default DrawerContent
