import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  AlertModal,
  CustomText,
  RowContainer,
  TouchableText,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {useToast} from '../../_customHook';
import {commonServices} from '../../_services/common.service';
import {useSelector} from 'react-redux';
import {getAuth} from '../../_store/_reducers/auth';

export default function SettingScreen({navigation}) {
  const [showToast, ToastComponent] = useToast();
  const {email} = useSelector(getAuth);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAcc = () => {
    commonServices
      .deleteAccount(email)
      .then(res => {
        showToast(res.data.message);
        navigation.navigate('login');
      })
      .catch(err => {
        console.log(err);
        showToast(err.message, 'error');
      });
  };
  return (
    <RowContainer>
      <View>
        <TouchableText
          style={styles.text}
          onPress={() => showToast('Already Updated', 'info')}>
          Check For Updates
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('Terms')}>
          Terms & Conditions
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('Privacy')}>
          Privacy & Policy
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => setModalVisible(true)}>
          Delete Account
        </TouchableText>
      </View>
      {ToastComponent}
      <AlertModal
        visible={modalVisible}
        image={require('../../images/akati-logo.png')}
        title={'Are you sure to delete your account?'}
        description={
          'Will you really want to delete your account? All your userdata will be deleted and can not be recovered.'
        }
        onOkay={() => {
          setModalVisible(false);
          handleDeleteAcc();
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  text: {
    margin: 5,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
  },
});
