import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Animated, Modal} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../../_utils/GlobalStyle';
import {GradientView} from '../../../components';

const {height: screenHeight} = Dimensions.get('window');

const CommentsBottomDrawer = ({
  visible,
  onClose,
  title,
  children,
  style,
  textSettings,
}) => {
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
      <View style={[styles.overlay]}>
        <Animated.View
          style={[
            styles.modal,
            style,
            {transform: [{translateY}]},
            {backgroundColor: textSettings?.backgroundColorSecondary},
          ]}>
          <GradientView style={styles.header} onPress={onClose}>
            <Icons name={'close'} size={20} color={Colors.white} />
          </GradientView>
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -45,
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalContent: {
    alignItems: 'center',
  },
});

export default CommentsBottomDrawer;
