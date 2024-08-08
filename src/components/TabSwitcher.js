// TabSwitcher.js
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Colors } from '../_utils/GlobalStyle';

const TabSwitcher = ({ tabs , primary = Colors.primary, tertiary = Colors.tertiary, textColor='#fff' }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].key);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const switchTab = (key) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTab(key);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderContent = () => {
    const currentTab = tabs.find(tab => tab.key === selectedTab);
    return currentTab ? currentTab.content : null;
  };

  return (
    <View style={[styles.container, {backgroundColor: tertiary}]}>
      <View style={[styles.tabContainer,{backgroundColor: primary}]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key ? styles.activeTab : {backgroundColor: primary},
            ]}
            onPress={() => switchTab(tab.key)}
          >
            <Text style={[styles.tabText,{color: textColor}]}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View style={{ opacity: fadeAnim }}>
        {renderContent()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.tertiary,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 50,
  },
  tab: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: Colors.secondary,
  },
  inactiveTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.white,
  },
  
});

export default TabSwitcher;
