import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
import {authService} from '../../_services/auth.service.js';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  Profile,
} from 'react-native-fbsdk-next';
import {emailRegex, passwordRegex} from '../../_helpers/form.helper.js';

export default function SignupScreen({navigation}) {
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('nameRequired'),
    last_name: Yup.string().required('nameRequiredLast'),
    email: Yup.string()
      .required('emailRequired')
      .matches(emailRegex, 'emailRequiredFormat'),
    birthday: Yup.date().typeError('dobRequiredFormat').required('dobRequired'),
    password: Yup.string()
      .required('passwordRequired')
      .matches(passwordRegex, 'passwordRequiredFormat'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'confirmPasswordRequiredMatch')
      .required('confirmPasswordRequired'),
    terms: Yup.boolean().oneOf([true], 'termsRequired'),
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
    console.log(data);
    return;
    authService
      .signIn(data)
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
    <ScrollView>
      <ContainerCenter>
        <Image style={GlobalStyles.logo} source={logo} resizeMode="contain" />
        <View style={{gap: 8}}>
          <CustomText style={styles.signInHeading}>Sign Up</CustomText>
          <CustomText style={styles.signInSubHeading}>
            Please fill the below details
          </CustomText>
        </View>
        <View style={{gap: 15, paddingTop: 20}}>
          <Input
            placeholder="Enter First Name"
            control={control}
            errors={errors}
            name="first_name"
          />
          <Input
            placeholder="Enter Last Name"
            control={control}
            errors={errors}
            name="last_name"
          />
          <Input
            placeholder="Enter Email Address"
            control={control}
            errors={errors}
            name="email"
          />
          <Input
            placeholder="Enter Language"
            control={control}
            errors={errors}
            name="language"
          />
          <Input
            placeholder="Enter Country Name"
            control={control}
            errors={errors}
            name="country"
          />
          <Input
            placeholder="Enter Your Birthday"
            control={control}
            errors={errors}
            name="birthday"
          />
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
            name="cpassword"
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
                label="I agree to the terms & conditions"
                checked={value}
                onChange={() => onChange(!value)}
              />
            )}
          />
        </RowContainer>
        <Button title="Sign Up" onPress={handleSubmit(handleFormSubmit)} />
      </ContainerCenter>
    </ScrollView>
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
