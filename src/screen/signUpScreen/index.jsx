import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {AlertModal, TouchableText} from '../../components/index.js';

export default function SignupScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name Required'),
    last_name: Yup.string().required('Last Name Required'),
    email: Yup.string()
      .required('Email Required')
      .matches(emailRegex, 'Enter a valid email'),
    birthday: Yup.date()
      .typeError('Follow (YYYY-MM-DD) format')
      .required('DOB Required'),
    password: Yup.string()
      .required('Password Required')
      .matches(
        passwordRegex,
        'Password should be 8 characters contains Upper, Lower Case, Number and Special Character',
      ),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Must same as passwprd')
      .required('Confirm Password Required'),
    terms: Yup.boolean().oneOf([true], 'Terms Required'),
    language: Yup.number(),
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
    authService
      .signUp(data)
      .then(res => {
        setModalVisible(true);
        console.log(res);
      })
      .catch(error => {
        console.log(error.message);
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
            name="confirm_password"
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
            name="terms"
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
        <View
          style={{
            marginVertical: 25,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableText
            style={styles.forgetText}
            onPress={() => navigation.navigate('login')}>
            Already account? Sign in
          </TouchableText>
        </View>
        <AlertModal
          visible={modalVisible}
          description="Check your mail Id. We have sent you an email to verify your mail."
          onOkay={() => {
            setModalVisible(false);
            navigation.navigate('login');
          }}
        />
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
