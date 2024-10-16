import React, {useState} from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';

const CustomSwitch = ({onChange, autoUnlock, textSettings}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  // Toggle the switch state
  const toggleSwitch = () => {
    onChange(!autoUnlock);
  };

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{false: Colors.tertiary, true: Colors.primary}} // Color of the track (off/on)
        thumbColor={autoUnlock ? Colors.secondary : '#f4f3f4'} // Color of the switch circle
        ios_backgroundColor="#3e3e3e" // Background color for iOS
        onValueChange={toggleSwitch} // Function to handle toggle
        value={autoUnlock} // Current value (true/false)
      />
      <Text style={{color: textSettings.color}}>
        {!autoUnlock ? 'Enable ' : 'Disable '}auto unlock
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
});

export default CustomSwitch;
