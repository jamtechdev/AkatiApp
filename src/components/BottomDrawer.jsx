// BottomModal.js
import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import {Colors} from '../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import { HeadingText } from '../components';

const {height: screenHeight} = Dimensions.get('window');

const BottomDrawer = ({visible, onClose, title, children}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? screenHeight * 0.3 : screenHeight,
      duration: 300,
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
        <Animated.View style={[styles.modal, {transform: [{translateY}]}]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
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
    // flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modal: {
    height: '80%',
    backgroundColor: Colors.tertiary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    padding: 20,
  },
  modalContent: {
    // justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    fontSize: 18,
    color: 'blue',
  },
  chapterText: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
  tabContent: {
    padding: 10,
    width: '100%',
  },
});

export default BottomDrawer;
