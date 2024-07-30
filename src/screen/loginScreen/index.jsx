import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle.js'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'
import logo from '../../images/logo.png'
import Button from '../../components/core/Button.js'
import Input from '../../components/core/Input.js'
import Divider from '../../components/Divider'
import CustomText from '../../components/core/CustomText'
import ContainerCenter from '../../components/ContainerCenter.js'
import RowContainer from '../../components/RowContainer.js'
import {yupResolver} from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {useForm, Controller} from 'react-hook-form'
import Checkbox from '../../components/core/CheckBox.js'

export default function LoginScreen () {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
    //   .min(8, "Password must be at least 8 characters"),
  })

  const formOptions = {
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  }
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm(formOptions)

  const onSubmit = (data) =>{
    console.log(data)
  }

  return (
    <ContainerCenter>
      <Image style={GlobalStyles.logo} source={logo} resizeMode='contain' />
      <View style={{gap: 8}}>
        <CustomText style={styles.signInHeading}>Sign In</CustomText>
        <CustomText style={styles.signInSubHeading}>
          Please fill the below details
        </CustomText>
      </View>
      <View style={{gap: 15, paddingTop: 20}}>
        <Input
          placeholder='Enter Email Address'
          control={control}
          errors={errors}
          name='email'
        />
        <Input
          placeholder='Enter your Password'
          control={control}
          errors={errors}
          name='password'
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
          name='rememberMe'
          defaultValue={false}
          render={({field: {onChange, value}}) => (
            <Checkbox
              label='Remember Me'
              checked={value}
              onChange={() => onChange(!value)}
            />
          )}
        />
        <CustomText style={styles.forgetText}> Forgot Password? </CustomText>
      </RowContainer>
      <Button title='Login' onPress={handleSubmit(onSubmit)} />
      <Divider title={'OR'} />
      <View style={{gap: 10}}>
        <Button
          title='Sign In With Google'
          onPress={() => console.log('Google Sign In pressed')}
          style={{backgroundColor: '#ea4335'}}
          gradient={false}
        />
        <Button
          title='Sign In With Facebook'
          onPress={() => console.log('Facebook Sign In pressed')}
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
  )
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
})
