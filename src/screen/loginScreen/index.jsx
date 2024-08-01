import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle.js';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../images/logo.png';
import {
  CustomText,
  Button,
  Input,
  Divider,
  Checkbox,
  ContainerCenter,
  TouchableText,
  RowContainer,
  AlertModal,
} from '../../components';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authService} from '../../_services/auth.service.js';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  Profile,
} from 'react-native-fbsdk-next';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';
import {useDispatch} from 'react-redux';
import {login} from '../../_store/_reducers/auth.js';
import { useAppContext } from '../../_customContext/AppProvider.js';

export default function LoginScreen({navigation}) {
  const { showToast, showLoader, hideLoader } = useAppContext();

  const dispatch = useDispatch();
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
      console.log(data);
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
        navigation.navigate('Main');
      })
      .catch(error => {
        console.log(error, 'network');
        showToast(error.message, 'error');
      });
  };

  const handleSocialLogin = data => {
    authService
      .socialAuth(data)
      .then(response => {
        dispatch(login(response.data));
        navigation.navigate('Main');
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
          if (Platform.OS == 'android') {
            console.log('android');
            AccessToken.getCurrentAccessToken().then(data => {
              const {accessToken} = data;
              initUser(accessToken);
            });
            return;
          }
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
  initUser = token => {
    fetch(
      'https://graph.facebook.com/v20.0/me?fields=id%2Cemail%2Cfirst_name%2Clast_name%2Cpicture&access_token=' +
        token,
    )
      .then(response => {
        response.json().then(currentProfile => {
          console.log('facebook currentProfile', currentProfile);
          const data = {
            fb_id: currentProfile.id,
            email: currentProfile.email,
            first_name: currentProfile.first_name,
            last_name: currentProfile.last_name,
            avatar: currentProfile.picture.data.url,
          };
          handleSocialLogin(data);
        });
      })
      .catch(() => {
        console.log('ERROR GETTING DATA FROM FACEBOOK');
      });
  };

  appleAuthHandler = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log('appleAuthRequestResponse', appleAuthRequestResponse);

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    console.log('credentialState', credentialState);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const {email} = jwtDecode(
        String(appleAuthRequestResponse?.identityToken),
      );
      let data = {
        apple_id: String(appleAuthRequestResponse?.identityToken),
        email: email,
        first_name: appleAuthRequestResponse?.fullName?.givenName ?? 'Akati',
        last_name: appleAuthRequestResponse?.fullName?.familyName ?? 'App',
        avatar: '',
      };
      console.log('data from google ', data);
      handleSocialLogin(data);
    }
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
        <TouchableText
          style={styles.forgetText}
          onPress={() => navigation.navigate('forgot')}>
          Forgot Password?{' '}
        </TouchableText>
      </RowContainer>
      <Button title="Login" onPress={handleSubmit(handleFormSubmit)} />
      <Divider title={'OR'} />
      <View style={{gap: 20, flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          title={<Icon size={25} name={'logo-google'} />}
          onPress={handleGoogleSignin}
          style={{backgroundColor: '#ea4335', width: 60, height: 60}}
          gradient={false}
        />
        <Button
          title={<Icon size={25} name={'logo-facebook'} />}
          onPress={handleFbSignin}
          style={{backgroundColor: '#5890ff', width: 60, height: 60}}
          gradient={false}
        />
        {Platform.OS == 'ios' && (
          <Button
            title={<Icon size={25} name={'logo-apple'} />}
            onPress={appleAuthHandler}
            style={{backgroundColor: '#666', width: 60, height: 60}}
            gradient={false}
          />
        )}
      </View>
      <View
        style={{
          marginVertical: 25,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableText
          style={styles.forgetText}
          onPress={() => navigation.navigate('signup')}>
          {' '}
          Create an account{' '}
        </TouchableText>
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
