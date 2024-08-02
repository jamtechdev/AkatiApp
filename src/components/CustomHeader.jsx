import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../_utils/GlobalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {getAuth} from '../_store/_reducers/auth';
const CustomHeader = ({title, showDrawer, showBack, navigation}) => {
  const {avatar} = useSelector(getAuth);
  return (
    <View style={styles.header}>
      {showBack && (
        <Ionicons
          name={'arrow-back'}
          size={22}
          color={'white'}
          onPress={() => navigation.goBack()}
        />
      )}
      {showDrawer && (
        <Ionicons
          name={'menu'}
          size={22}
          color={'white'}
          onPress={() => navigation.toggleDrawer()}
        />
      )}
      <Text style={styles.title}>{title}</Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons
          name={'notifications'}
          size={25}
          color={'white'}
          onPress={() => navigation.navigate('notification')}
        />
        {avatar ? (
          <TouchableOpacity onPress={() => navigation.navigate('profile')}>
            <Image
              source={require('../images/avtar.png')}
              style={{height: 25, width: 25, borderRadius: 50}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('profile')}>
            <Icons name={'user-circle-o'} size={25} color={'white'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.tertiary, // Adjust as needed
  },
  title: {
    fontSize: 20,
    color: 'white', // Adjust as needed
  },
});

export default CustomHeader;
