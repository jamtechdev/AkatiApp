/* eslint-disable prettier/prettier */
// src/components/DrawerContent.js
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Share} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import logo from '../images/logo.png';
import {Colors} from '../_utils/GlobalStyle';
import {
  AlertModal,
  Button,
  CustomDrawerItem,
  GradientView,
} from '../components';
import {useDispatch} from 'react-redux';
import {logout} from '../_store/_reducers/auth';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const DrawerContent = props => {
  const [show, setShow] = useState(false);
  const toggleModel = () => setShow(prev => !prev);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const logoutAction = async () => {
    dispatch(logout());
    toggleModel();
    setTimeout(() => {
      navigation.replace('Auth');
    }, 500);
  };

  const handleShare = () => {
    Share.share({
      title: 'Akati',
      text: `Check out this site for read more interesting book with multiple language. for more book please download and explore thousands of books.for android please check this: https://play.google.com/store/apps/details?id=com.akati, and for iOS please check this : https://apps.apple.com/in/app/akati/id1633617962  or for web please check the https://app.feupsontec.com`,
      url: 'https://app.feupsontec.com',
    })
      .then(() => console.log('Successfully shared'))
      .catch(error => console.log('Error sharing', error));
  };

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={{backgroundColor: Colors.tertiary}}>
        <View style={{position: 'absolute', right: 0, top: 20, zIndex: 999}}>
          <GradientView
            style={styles.rightButton}
            onPress={() => props.navigation.toggleDrawer()}>
            <Icons size={20} color={Colors.white} name={'indent'}></Icons>
          </GradientView>
        </View>

        <View style={styles.drawerHeader}>
          <Image
            source={logo} // Replace with your own image URL
            style={styles.profileImage}
          />
          {/* <Text style={styles.drawerTitle}>Akati</Text> */}
        </View>

        <CustomDrawerItem
          title="Discover"
          icon={'explore'}
          onPress={() => props.navigation.navigate('Discover')}
        />

        <CustomDrawerItem
          title="Recharge"
          icon={'refresh'}
          onPress={() => props.navigation.navigate('Recharge')}
        />

        <CustomDrawerItem
          title="Recharge History"
          icon={'history'}
          onPress={() => props.navigation.navigate('RechargeHistory')}
        />

        <CustomDrawerItem
          title="Reviews"
          icon={'rate-review'}
          onPress={() => props.navigation.navigate('Review')}
        />

        <CustomDrawerItem
          title="Language"
          icon={'language'}
          onPress={() => props.navigation.navigate('Language')}
        />

        <CustomDrawerItem
          title="Settings"
          icon={'settings'}
          onPress={() => props.navigation.navigate('Settings')}
        />

        <CustomDrawerItem
          title="Share with Friend"
          icon={'share'}
          onPress={handleShare}
        />
      </DrawerContentScrollView>
      <AlertModal
        visible={show}
        image={logo}
        title={'Alert!'}
        description={'Are you sure you want to logout?'}
        onOkay={logoutAction}
        onCancel={toggleModel}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          left: 0,
          right: 0,
          margin: 'auto',
          justifyContent: 'center',
          padding: 20,
          backgroundColor: Colors.primary,
        }}>
        <Button title="Logout" onPress={()=>logoutAction()}></Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  profileImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  rightButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
});

export default DrawerContent;
