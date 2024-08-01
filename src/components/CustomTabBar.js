// src/components/CustomTabBar.js
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../_utils/GlobalStyle';

const CustomTabBar = ({state, descriptors, navigation,}) => {
  return (
    <View style={styles.tabContainer}>
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconName = route.name === 'Library' ? 'menu-book' : route.name == 'Home' ? 'home' : 'search';
 
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <View style={isFocused ? styles.activeTab : styles.inactiveTab}>
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? 'white' : 'gray'}
              />
              {/* {isFocused && (
                <Text style={styles.activeLabel}>
                  {route.name}
                </Text>
              )} */}
            </View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
            key={"more"}
            accessibilityRole="button"
            onPress={()=> navigation.toggleDrawer()}
            style={styles.tab}
          >
            <View style={styles.inactiveTab}>
              <Ionicons
                name={'menu'}
                size={22}
                color={'gray'}
              />
              {/* {isFocused && (
                <Text style={styles.activeLabel}>
                  {route.name}
                </Text>
              )} */}
            </View>
          </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: Colors.primary, 
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tertiary,  // Ensure the tab bar is transparent
    height:70,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0,  // Remove border if not needed
    // margin:10,
    borderRadius:50,
    width:"90%",
    marginHorizontal:"auto"
  },
  tab: {
  paddingHorizontal:10
  },
  inactiveTab:{
    height:40,
    width:40,
    borderRadius: 50,  // Increased radius for circular effect
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: Colors.secondary,  // Background color for the active tab
    borderRadius: 50,  // Increased radius for circular effect
    alignItems: 'center',
    justifyContent: 'center',
    height:40,
    width:40,
  },
  activeLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTabBar;
