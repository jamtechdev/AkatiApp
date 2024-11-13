/* eslint-disable prettier/prettier */
// src/components/DrawerContent.js
import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {getLanguage, logout} from '../_store/_reducers/auth';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {getLanguageCode, languageMap} from '../_helpers';
import {useTranslation} from 'react-i18next';
const DrawerContent = props => {
  const [show, setShow] = useState(false);
  const toggleModel = () => setShow(prev => !prev);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const language = useSelector(getLanguage);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    const local = languageMap[language];
    console.log(language, '================ test', local);
    i18n.changeLanguage(local);
  }, [language]);
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
      text: `Check out this site for read more interesting book with multiple language. for more book please download and explore thousands of books.for android please check this: https://play.google.com/store/apps/details?id=com.akati, and for iOS please check this : https://apps.apple.com/in/app/akati/id1633617962  or for web please check the https://app.akatibird.com`,
      url: 'https://app.akatibird.com',
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
          title={t('screens.sideBar.discover')}
          icon={'explore'}
          isActive={props.state.index == 0}
          onPress={() => props.navigation.navigate('Discover')}
        />

        <CustomDrawerItem
          title={t('screens.sideBar.recharge')}
          icon={'refresh'}
          isActive={props.state.index == 1}
          onPress={() => props.navigation.navigate('Recharge')}
        />

        <CustomDrawerItem
          title={t('screens.sideBar.rechargeHistory')}
          icon={'history'}
          isActive={props.state.index == 2}
          onPress={() => props.navigation.navigate('RechargeHistory')}
        />

        <CustomDrawerItem
          title={t('screens.sideBar.reviews')}
          icon={'rate-review'}
          isActive={props.state.index == 3}
          onPress={() => props.navigation.navigate('Review')}
        />

        <CustomDrawerItem
          title={t('screens.sideBar.languages')}
          icon={'language'}
          isActive={props.state.index == 4}
          onPress={() => props.navigation.navigate('Language')}
        />

        <CustomDrawerItem
          title={t('screens.sideBar.setting')}
          icon={'settings'}
          isActive={props.state.index == 5}
          onPress={() => props.navigation.navigate('Settings')}
        />

        <CustomDrawerItem
          title={t('screens.sideBar.shareFriend')}
          icon={'share'}
          onPress={handleShare}
        />
      </DrawerContentScrollView>
      <AlertModal
        visible={show}
        image={logo}
        title={t('screens.sideBar.alert')}
        description={t('screens.sideBar.logoutModelHeader')}
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
        <Button
          title={t('screens.sideBar.logout')}
          onPress={() => toggleModel()}></Button>
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
