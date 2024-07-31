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
import {useLoader, useToast} from '../../_customHook';

export default function ForgotScreen({navigation}) {
  const [otp, setOtp] = useState('');
  const [mail, setMail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [msg, setMsg] = useState('');
  const [showToast, ToastComponent] = useToast();
  const [showLoader, hideLoader, LoaderComponent] = useLoader();
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
      showToast('Please enter a valid email.');
      hideLoader();
    } else {
      authService
        .sendOtp({email: mail})
        .then(res => {
          if (res.data.status) {
            setIsSent(true);
            showToast('OTP Sent on your mail.');
          } else {
            console.log(res.data.email[0]);
            showToast(res.data.email[0]);
          }
        })
        .catch(error => {
          console.log(error?.response?.data?.email[0]);
          showToast(error?.response?.data?.email[0]);
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
            showToast('OTP Verified.');
          } else {
            console.log(res.data?.message);
            showToast(res.data?.message);
          }
        })
        .catch(error => {
          console.log(error.message);
          showToast(error.message);
        })
        .finally(() => hideLoader());
    } else {
      console.log('Invalid OTP entered!');
      showToast('Invalid OTP entered!');
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
          showToast('Password Changed Successfully');
          navigation.navigate('login');
        }
      })
      .catch(error => {
        console.log(error.message);
        showToast(error.message);
      })
      .finally(() => hideLoader());
  };

  return (
    <ContainerCenter>
      <TouchableOpacity
        style={{
          marginVertical: 20,
        }}
        onPress={() => navigation.navigate('login')}>
        <BackButton />
      </TouchableOpacity>
      <Image style={GlobalStyles.logo} source={logo} resizeMode="contain" />
      <View style={{gap: 8}}>
        <CustomText style={styles.signInHeading}>Forgot Password</CustomText>
        <CustomText style={styles.signInSubHeading}>
          Please fill the below details
        </CustomText>
      </View>
      {!isSent ? (
        <View style={{gap: 15, paddingTop: 25}}>
          <TextInput
            style={GlobalStyles.inputView}
            placeholderTextColor={Colors.darkGray}
            placeholder={'Enter Your Email'}
            onChangeText={e => setMail(e)}
            value={mail}
            secureTextEntry={false}
          />
          <Button title="Send OTP" onPress={handleSendOtp} />
        </View>
      ) : !isVerified ? (
        <View style={{gap: 15, paddingTop: 25}}>
          <TextInput
            style={GlobalStyles.inputView}
            placeholderTextColor={Colors.darkGray}
            placeholder={'Enter OTP'}
            onChangeText={e => setOtp(e)}
            value={otp}
            secureTextEntry={false}
          />
          <Button title="Verify OTP" onPress={() => handleVerifyOtp(otp)} />
        </View>
      ) : (
        <View style={{gap: 15, paddingTop: 25}}>
          <Input
            placeholder="Enter your Password"
            control={control}
            errors={errors}
            name="password"
            secureTextEntry={true}
          />
          <Input
            placeholder="Confirm Password"
            control={control}
            errors={errors}
            name="confirm_password"
            secureTextEntry={true}
          />
          <Button
            title="Change Password"
            onPress={handleSubmit(handlePasswordChange)}
          />
        </View>
      )}
      {ToastComponent}
      {LoaderComponent}
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
