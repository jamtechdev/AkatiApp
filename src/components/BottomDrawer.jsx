import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Animated, Modal} from 'react-native';
import {Colors} from '../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import {HeadingText} from '../components';

const {height: screenHeight} = Dimensions.get('window');

const BottomDrawer = ({visible, onClose, title, children, style}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : screenHeight,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none" // Disable the default animation
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.modal, style, {transform: [{translateY}]}]}>
          <View style={styles.header}>
            <HeadingText>{title}</HeadingText>
            <Icons
              name={'close'}
              size={20}
              color={Colors.white}
              onPress={onClose}
            />
          </View>
          <View style={styles.modalContent}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modal: {
    height: '50%', // Adjust this value as needed
    backgroundColor: Colors.tertiary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    padding: 20,
    // marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
});

export default BottomDrawer;
