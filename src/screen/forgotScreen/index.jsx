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
  
  export default function ForgotScreen({navigation}) {
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
  
    return (
      <ContainerCenter>
        <Image style={GlobalStyles.logo} source={logo} resizeMode="contain" />
        <View style={{gap: 8}}>
          <CustomText style={styles.signInHeading}>Forgot</CustomText>
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
  