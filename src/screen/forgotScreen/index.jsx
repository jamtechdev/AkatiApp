import * as Yup from 'yup';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import logo from '../../images/logo.png';
import {yupResolver} from '@hookform/resolvers/yup';
import {useToast} from 'react-native-toast-notifications';
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

export default function ForgotScreen({navigation}) {
  const toast = useToast();
  const [otp, setOtp] = useState('');
  const [mail, setMail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
    if (emailRegex.test(mail) === false) {
      toast.show('Please enter a valid email');
    } else {
      authService
        .sendOtp({email: mail})
        .then(res => {
          if (res.data.status) {
            toast.show('OTP sent successfully.');
            setIsSent(true);
          } else {
            toast.show(res.data.email[0]);
          }
        })
        .catch(error => {
          toast.show(error?.response?.data?.email[0]);
        });
    }
  };

  const handleVerifyOtp = code => {
    const data = {
      email: mail,
      otp: code,
    };
    if (code.length) {
      authService
        .verifyOtp(data)
        .then(res => {
          if (res.data.success) {
            toast.show('OTP verifed.');
            setIsVerified(true);
          } else {
            toast.show(res.data?.message);
          }
        })
        .catch(error => {
          toast.show(error.message);
        });
    } else {
      toast.show('Invalid OTP entered!');
    }
  };

  const handlePasswordChange = data => {
    const formData = {
      email: mail,
      password: data.confirm_password,
    };
    authService
      .resetPassword(formData)
      .then(res => {
        if (res.data.success) {
          toast.show('Password changed successfully!');
          navigation.navigate('login');
        }
      })
      .catch(error => {
        toast.show(error.message);
      });
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
          <Button title="Send OTP" onPress={handleSendOtp} disabled={isSent} />
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
          <Button
            title="Verify OTP"
            onPress={() => handleVerifyOtp(otp)}
            disabled={isSent}
          />
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
            disabled={isSent}
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
