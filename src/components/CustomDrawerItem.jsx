/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icons from 'react-native-vector-icons/MaterialIcons';
import GlobalStyles, { Colors } from '../_utils/GlobalStyle';

const CustomDrawerItem = ({icon,title, onPress, isActive = false, }) => {
  if (isActive) {
    return (
      <TouchableOpacity onPress={onPress} style={[GlobalStyles.btnTouchable, {paddingRight:30}]}>
        <LinearGradient
          colors={['rgba(255, 81, 47, 1)', 'rgba(221, 36, 118, 1)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[GlobalStyles.btnPrimary,  styles.btnRow]}>
         {icon &&  <Icons size={25} name={icon} />}
          <Text style={[GlobalStyles.textWhite, styles.buttonText]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[GlobalStyles.btnPrimary, styles.btnRow]}>
        {icon &&  <Icons size={20} name={icon} color={Colors.white}/>}
      <Text style={[GlobalStyles.textWhite, styles.buttonText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  btnRow:{
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems:'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical:12,
    marginVertical:5,
    borderRadius:0,
    borderTopRightRadius:50,
    borderBottomRightRadius:50,
  }
});

export default CustomDrawerItem;
