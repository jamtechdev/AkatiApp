import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  AlertModal,
  CustomText,
  HeadingText,
  RowContainer,
  TouchableText,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {commonServices} from '../../_services/common.service';
import {useSelector} from 'react-redux';
import {getAuth} from '../../_store/_reducers/auth';
import {useAppContext} from '../../_customContext/AppProvider';
import {useTranslation} from 'react-i18next';

export default function SettingScreen({navigation}) {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const {email} = useSelector(getAuth);
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();
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
      <View style={{paddingBottom: 20}}>
        <HeadingText>{t('screens.setting.title')}</HeadingText>
      </View>
      <View>
        <TouchableText
          style={styles.text}
          onPress={() => showToast(t('screens.setting.updated'), 'info')}>
          {t('screens.setting.checkUpdate')}
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('Terms')}>
          {t('screens.setting.terms')}
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('Privacy')}>
          {t('screens.setting.privacy')}
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => setModalVisible(true)}>
          {t('screens.setting.delete')}
        </TouchableText>
      </View>
      <AlertModal
        visible={modalVisible}
        image={require('../../images/akati-logo.png')}
        title={t('screens.setting.sure')}
        description={t('screens.setting.confirmation')}
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
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
  },
});
