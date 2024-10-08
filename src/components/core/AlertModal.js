import React from 'react';
import {View, Modal, Image, StyleSheet} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import {Button, CustomText} from '../../components';
import {useTranslation} from 'react-i18next';

const AlertModal = ({visible, image, title, description, onCancel, onOkay}) => {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {image && <Image source={image} style={styles.image} />}
          <CustomText style={styles.title}>{title || 'Alert'}</CustomText>
          <CustomText style={styles.description}>
            {description || ''}
          </CustomText>
          <View style={styles.buttonContainer}>
            {onOkay && (
              <Button
                style={styles.button}
                title={t('screens.action.ok')}
                onPress={onOkay}
              />
            )}
            {onCancel && (
              <Button
                style={styles.button}
                title={t('screens.action.cancel')}
                onPress={onCancel}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: '#2196F3',
    width: '100%',
    display: 'flex',
  },
  buttonText: {
    color: 'white',
    fontWeight: 800,
    textAlign: 'center',
  },
});

export default AlertModal;
