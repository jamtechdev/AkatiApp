import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../_utils/GlobalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {getAuth} from '../_store/_reducers/auth';
import {CustomText, GradientView} from '.';
const CustomHeader = ({title, showDrawer, showBack, navigation}) => {
  const {avatar} = useSelector(getAuth);
  return (
    <View style={styles.header}>
      {showBack && (
        <GradientView
          style={styles.leftButton}
          onPress={() => navigation.goBack()}>
          <Icons name={'long-arrow-left'} size={20} color={'white'} />
        </GradientView>
      )}
      {showDrawer && (
        <GradientView
          style={styles.leftButton}
          onPress={() => navigation.toggleDrawer()}>
          <Icons name={'outdent'} size={20} color={'white'} />
        </GradientView>
      )}
      <View style={{paddingLeft: 20}}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <GradientView style={styles.iconButton}>
          <Ionicons
            name={'notifications'}
            size={20}
            color={'white'}
            onPress={() => navigation.navigate('notification')}
          />
        </GradientView>
        <GradientView style={styles.iconButton} onPress={() => navigation.navigate('profile')} >
          {avatar ? (
            <Image
              source={require('../images/avtar.png')}
              style={{height: 25, width: 25, borderRadius: 50}}
            />
          ) : (
            <Icons name={'user'} size={20} color={'white'} />
          )}
        </GradientView>
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
    paddingRight: 20,
    backgroundColor: Colors.tertiary, // Adjust as needed
  },
  title: {
    fontSize: 20,
    color: 'white', // Adjust as needed
  },
  iconButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    borderRadius: 50,
  },
  leftButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default CustomHeader;
