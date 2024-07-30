import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle.js';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../images/logo.png';
import Button from '../../components/core/Button.js';
import Input from '../../components/core/Input.js';
import Divider from '../../components/Divider.jsx';
import CustomText from '../../components/core/CustomText.jsx';
import ContainerCenter from '../../components/ContainerCenter.js';
import RowContainer from '../../components/RowContainer.js';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import Checkbox from '../../components/core/CheckBox.js';
import {authService} from '../../_services/auth.service.js';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  Profile,
} from 'react-native-fbsdk-next';
import {emailRegex, passwordRegex} from '../../_helpers/form.helper.js';
import {useToast} from 'react-native-toast-notifications';

export default function ForgotScreen({navigation}) {
  const toast = useToast();
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

  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [mail, setMail] = useState('');
  const [otp, setOtp] = useState('');
  const handleFormSubmit = async data => {
    const modify = {
      ...data,
      device_token: 'teststs',
    };
    authService
      .signIn(modify)
      .then(res => {
        dispatch(login(res.data));

        toast.success('Login Successful');
      })
      .catch(error => {
        toast.error('Invalid credentials');
      });
  };
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
      <Image style={GlobalStyles.logo} source={logo} resizeMode="contain" />
      <View style={{gap: 8}}>
        <CustomText style={styles.signInHeading}>Forgot</CustomText>
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
  rememberText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: 500,
  },
  forgetText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: 500,
    textDecorationLine: 'underline',
  },
});
