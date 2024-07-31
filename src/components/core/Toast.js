// Toast.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const Toast = ({ visible, message, description, duration = 3000, onHide }) => {
  const [show, setShow] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShow(false);
          if (onHide) onHide();
        });
      }, duration);
    }
  }, [visible, fadeAnim, duration, onHide]);

  if (!show) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastMessage}>{message}</Text>
      {description && ( <Text style={styles.toastMessage}>{description}</Text>)}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  toastMessage: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Toast;
