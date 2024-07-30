import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle.js';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../images/logo.png';
import Button from '../../components/core/Button.js';
import Input from '../../components/core/Input.js';
import Divider from '../../components/Divider';
import CustomText from '../../components/core/CustomText';
import ContainerCenter from '../../components/ContainerCenter.js';
import RowContainer from '../../components/RowContainer.js';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import Checkbox from '../../components/core/CheckBox.js';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authService} from '../../_services/auth.service.js';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  Profile,
} from 'react-native-fbsdk-next';

export default function LoginScreen() {
  GoogleSignin.configure({
    androidClientId:
      '591314454636-3hvt5rv5ggf7hbvectrcvgvmjpjtsc1l.apps.googleusercontent.com',
    iosClientId:
      '591314454636-05gg6a53afakif106il7arr12eu5l5ig.apps.googleusercontent.com',
  });
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
    //   .min(8, "Password must be at least 8 characters"),
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

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const {user} = await GoogleSignin.signIn();
      let data = {
        google_id: user.id,
        email: user.email,
        first_name: user.givenName,
        last_name: user.familyName,
        avatar: user.photo,
      };
      console.log(data)
      handleSocialLogin(data);
    } catch (error) {
      console.log(error);
    }
  };

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
        console.log(error);
        toast.error('Invalid credentials');
      });
  };

  const handleSocialLogin = data => {
    authService
      .socialAuth(data)
      .then(response => {
        dispatch(login(response.data));
        console.log(response);
        // toast.success("Login Successful");
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleFbSignin = async () => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(result);
          // if (Platform.OS == 'android') {
          //   console.log('android')
          //   AccessToken.getCurrentAccessToken().then((data) => {
          //     const { accessToken } = data
          //     this.initUser(accessToken)
          //   })
          //   return
          // }
          Profile.getCurrentProfile().then(function (currentProfile) {
            if (currentProfile) {
              console.log('The current logged user is: ', currentProfile);
              const data = {
                fb_id: currentProfile.userID,
                email: currentProfile.email,
                first_name: currentProfile.firstName,
                last_name: currentProfile.lastName,
                avatar: currentProfile.imageURL,
              };
              console.log('data sending in API', data);

            }
          });
        }
      },
    );
  };

  return (
    <ContainerCenter>
      <Image style={GlobalStyles.logo} source={logo} resizeMode="contain" />
      <View style={{gap: 8}}>
        <CustomText style={styles.signInHeading}>Sign In</CustomText>
        <CustomText style={styles.signInSubHeading}>
          Please fill the below details
        </CustomText>
      </View>
      <View style={{gap: 15, paddingTop: 20}}>
        <Input
          placeholder="Enter Email Address"
          control={control}
          errors={errors}
          name="email"
        />
        <Input
          placeholder="Enter your Password"
          control={control}
          errors={errors}
          name="password"
          secureTextEntry={true}
        />
      </View>
      <RowContainer
        style={{
          paddingVertical: 12,
          marginTop: 10,
        }}>
        <Controller
          control={control}
          name="rememberMe"
          defaultValue={false}
          render={({field: {onChange, value}}) => (
            <Checkbox
              label="Remember Me"
              checked={value}
              onChange={() => onChange(!value)}
            />
          )}
        />
        <CustomText style={styles.forgetText}> Forgot Password? </CustomText>
      </RowContainer>
      <Button title="Login" onPress={handleSubmit(handleFormSubmit)} />
      <Divider title={'OR'} />
      <View style={{gap: 10}}>
        <Button
          title="Sign In With Google"
          onPress={handleGoogleSignin}
          style={{backgroundColor: '#ea4335'}}
          gradient={false}
        />
        <Button
          title="Sign In With Facebook"
          onPress={handleFbSignin}
          style={{backgroundColor: '#5890ff'}}
          gradient={false}
        />
      </View>
      <View
        style={{
          marginVertical: 25,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CustomText style={styles.forgetText}> Create an account </CustomText>
      </View>
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
