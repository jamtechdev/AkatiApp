import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Image,
  Text,
} from 'react-native';

const Loader = ({visible}) => (
  <Modal
    transparent={true}
    animationType="none"
    visible={visible}
    onRequestClose={() => {}}
    style={{zIndex: 999999999999}}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <Image source={require('../../images/page-loader.gif')} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  activityIndicatorWrapper: {
    // backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;
