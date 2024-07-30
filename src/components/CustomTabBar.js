// src/components/CustomTabBar.js
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
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

        const iconName = route.name === 'Library' ? 'ios-library' : 'ios-search';

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
                size={24}
                color={isFocused ? 'white' : 'gray'}
              />
              {isFocused && (
                <Text style={styles.activeLabel}>
                  {route.name}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',  // Ensure the tab bar is transparent
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,  // Remove border if not needed
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'tomato',  // Background color for the active tab
    borderRadius: 50,  // Increased radius for circular effect
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTabBar;
