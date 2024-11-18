import React, { useEffect } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../_utils/GlobalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth, languageSet} from '../_store/_reducers/auth';
import {CustomText, GradientView} from '.';
import {useTranslation} from 'react-i18next';
import { useAppContext } from '../_customContext/AppProvider';
import { languageMap } from '../_helpers';
const CustomHeader = ({title, showDrawer, showBack, navigation}) => {
  const {avatar, loggedIn, language} = useSelector(getAuth);
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const {showToast, showLoader, hideLoader} = useAppContext();
  const languageData = [
    {
      label: 'EN',
      value: 1,
      code: 'en'
    },{
      label: 'FR',
      value: 2,
      code: 'fr'
    },{
      label: 'DE',
      value: 3,
      code: 'de'
    }
  ];
  useEffect(() => {
    console.log(language,"language");
    
    if(language !==undefined ){
      const langCode = languageMap[language];
      if(langCode){
      i18n.changeLanguage(langCode);
      }
    }
  }, [ ]);

  const handleLanguageClick = lang => {
    dispatch(languageSet(lang.value));
    i18n.changeLanguage(lang.code);
    showToast(t('screens.alert.languageChange'), 'success');
  };
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
      {title && (
        <View style={{paddingLeft: 20}}>
          <Text style={styles.title}>{t(`screens.header.${title}`)}</Text>
        </View>
      )}
      {loggedIn && (
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <GradientView
            style={styles.iconButton}
            onPress={() => navigation.navigate('notification')}>
            <Ionicons name={'notifications'} size={20} color={'white'} />
          </GradientView>
          <GradientView
            style={styles.iconButton}
            onPress={() => navigation.navigate('profile')}>
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
      )}
      {!loggedIn && (
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {languageData &&
            languageData.map((lang, index) => {
              return (
                <GradientView
                  key={index}
                  style={styles.iconButton}
                  gradient={lang.value == language ? true :false}
                  onPress={() => handleLanguageClick(lang)}>
                  <Text style={lang.value == language ? styles.activeText : styles.inActiveText }>{lang.label}</Text>
                </GradientView>
              );
            })}
        </View>
      )}
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
  activeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  inActiveText: {
    color: Colors.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
