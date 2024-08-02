// Toast.js
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../_utils/GlobalStyle';

const Toast = ({
  visible,
  message,
  description,
  duration = 3000,
  onHide,
  type = 'success',
}) => {
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
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          backgroundColor:
            type == 'success'
              ? Colors.success
              : type == 'info'
              ? Colors.info
              : Colors.danger,
        },
      ]}>
      <View style={styles.toastMessage}>
        {type == 'success' && (
          <Icon size={20}  color={Colors.white} name={'checkmark-circle-outline'} />
        )}
        {type == 'info' && <Icon size={20} name={'information-circle-outline'} color={Colors.white}/>}
        {type == 'error' && (
          <Icon size={20} color={Colors.white} name={'close-circle-outline'} />
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
      {description && <Text style={styles.toastMessage}>{description}</Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    margin: 'auto',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999999,
  },
  message:{
    color: Colors.white,
  },
  toastMessage: {
    color: Colors.white,
    textAlign: 'left',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 5,
  },
});

export default Toast;
