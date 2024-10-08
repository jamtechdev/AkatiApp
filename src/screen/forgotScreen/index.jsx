import * as Yup from 'yup';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import logo from '../../images/logo.png';
import {yupResolver} from '@hookform/resolvers/yup';
import {authService} from '../../_services/auth.service.js';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle.js';
import {emailRegex, passwordRegex} from '../../_helpers/form.helper.js';
import {ContainerCenter, CustomText, Button, Input} from '../../components';
import BackButton from '../../components/core/BackButton.js';
import {useAppContext} from '../../_customContext/AppProvider.js';
import {useTranslation} from 'react-i18next';

export default function ForgotScreen({navigation}) {
  const [otp, setOtp] = useState('');
  const [mail, setMail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [msg, setMsg] = useState('');
  const {showToast, showLoader, hideLoader} = useAppContext();
  const {t} = useTranslation();
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('newPasswordRequired')
      .matches(passwordRegex, 'passwordRequiredFormat'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'confirmPasswordRequiredMatch')
      .required('confirmPasswordRequired'),
  });

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  };
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm(formOptions);

  const handleSendOtp = () => {
    showLoader();
    if (emailRegex.test(mail) === false) {
      showToast(t('screens.formValidation.emailRequiredFormat'), 'info');
      hideLoader();
    } else {
      authService
        .sendOtp({email: mail})
        .then(res => {
          if (res.data.status) {
            setIsSent(true);
            showToast(t('screens.forget.otpSent'), 'success');
          } else {
            console.log(res.data.email[0]);
            showToast(res.data.email[0], 'error');
          }
        })
        .catch(error => {
          console.log(error?.response?.data?.email[0]);
          showToast(error?.response?.data?.email[0], 'error');
        })
        .finally(() => hideLoader());
    }
  };

  const handleVerifyOtp = code => {
    showLoader();
    const data = {
      email: mail,
      otp: code,
    };
    if (code.length) {
      authService
        .verifyOtp(data)
        .then(res => {
          if (res.data.success) {
            setIsVerified(true);
            showToast(t('screens.forget.verified'), 'success');
          } else {
            console.log(res.data?.message);
            showToast(res.data?.message, 'info');
          }
        })
        .catch(error => {
          console.log(error.message);
          showToast(error.message, 'error');
        })
        .finally(() => hideLoader());
    } else {
      console.log('Invalid OTP entered!');
      showToast('Invalid OTP entered!', 'error');
      hideLoader();
    }
  };

  const handlePasswordChange = data => {
    showLoader();
    const formData = {
      email: mail,
      password: data.confirm_password,
    };
    authService
      .resetPassword(formData)
      .then(res => {
        if (res.data.success) {
          showToast(t('screens.forget.success'), 'success');
          setTimeout(() => {
            navigation.navigate('login');
          }, 2000);
        }
      })
      .catch(error => {
        console.log(error.message);
        showToast(error.message, 'error');
      })
      .finally(() => hideLoader());
  };

  return (
    <ContainerCenter>
      {/* <TouchableOpacity
        style={{
          marginVertical: 20,
        }}
        onPress={() => navigation.navigate('login')}>
        <BackButton />
      </TouchableOpacity> */}
      <Image style={GlobalStyles.logo} source={logo} resizeMode="contain" />
      <View style={{gap: 8}}>
        <CustomText style={styles.signInHeading}>
          {t('screens.forget.forgetPassword')}
        </CustomText>
        <CustomText style={styles.signInSubHeading}>
          {t('screens.forget.forgetDescription')}
        </CustomText>
      </View>
      {!isSent ? (
        <View style={{gap: 15, paddingTop: 25}}>
          <TextInput
            style={GlobalStyles.inputView}
            placeholderTextColor={Colors.darkGray}
            placeholder={t('screens.forget.emailPlaceholder')}
            onChangeText={e => setMail(e)}
            value={mail}
            secureTextEntry={false}
          />
          <Button title={t('screens.forget.otp')} onPress={handleSendOtp} />
        </View>
      ) : !isVerified ? (
        <View style={{gap: 15, paddingTop: 25}}>
          <TextInput
            style={GlobalStyles.inputView}
            placeholderTextColor={Colors.darkGray}
            placeholder={t('screens.forget.otpPlaceholder')}
            onChangeText={e => setOtp(e)}
            value={otp}
            secureTextEntry={false}
          />
          <Button
            title={t('screens.forget.verify')}
            onPress={() => handleVerifyOtp(otp)}
          />
        </View>
      ) : (
        <View style={{gap: 15, paddingTop: 25}}>
          <Input
            placeholder={t('screens.forget.passwordPlaceholder')}
            control={control}
            errors={errors}
            name="password"
            secureTextEntry={true}
          />
          <Input
            placeholder={t('screens.forget.cpasswordPlaceholder')}
            control={control}
            errors={errors}
            name="confirm_password"
            secureTextEntry={true}
          />
          <Button
            title={t('screens.forget.reset')}
            onPress={handleSubmit(handlePasswordChange)}
          />
        </View>
      )}
    </ContainerCenter>
  );
}

const styles = StyleSheet.create({
  signInHeading: {
    fontSize: 30,
    fontWeight: 600,
  },
  signInSubHeading: {
    fontSize: 18,
    fontWeight: 200,
  },
  backButton: {
    width: 150,
    marginBottom: 10,
    padding: 0,
  },
});
