/* eslint-disable prettier/prettier */
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
export default function LoginScreen () {
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
          onChangeText={e => console.log(e)}
        />
        <Input
          placeholder='Enter your Password'
          onChangeText={e => console.log(e)}
          secureTextEntry={true}
        />
      </View>
      <RowContainer
        style={{
          paddingVertical: 12,
          marginTop: 10,
        }}>
        <RowContainer
          style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Icon name='checkbox' size={20} color={Colors.secondary} />
          <CustomText style={styles.rememberText}> Remember Me </CustomText>
        </RowContainer>
        <CustomText style={styles.forgetText}> Forgot Password? </CustomText>
      </RowContainer>
      <Button title='Login' onPress={() => console.log('Login pressed')} />
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
