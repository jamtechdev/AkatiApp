import React, {useEffect, useState} from 'react';
import {
  CustomText,
  GradientView,
  HeadingText,
  RowContainer,
} from '../../components';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import avatar from '../../images/avtar.png';
import {Colors} from '../../_utils/GlobalStyle';
import {authService} from '../../_services/auth.service';
import {useTranslation} from 'react-i18next';
function ProfileScreen() {
  const [userDetails, setUserDetails] = useState();
  const {t} = useTranslation();

  const [languages, setLanguages] = useState([
    {label: 'English', value: '1'},
    {label: 'French', value: '2'},
    {label: 'German', value: '3'},
  ]);

  useEffect(() => {
    authService
      .profileDetails()
      .then(res => {
        setUserDetails(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <RowContainer>
      <View style={styles.profileView}>
        <View style={styles.avatarWrapper}>
          <Image
            source={userDetails?.avatar_url ? userDetails?.avatar_url : avatar}
            style={styles.avatar}
          />
        </View>
        <View style={{marginVertical: 15}}>
          <GradientView
            style={{
              fontWeight: 700,
              color: Colors.secondary,
              backgroundColor: Colors.secondary,
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 50,
            }}>
            <Text style={{color: Colors.white}}>
              Coins : {userDetails?.coins}
            </Text>
          </GradientView>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            width: '100%',
          }}>
          <View
            style={{
              backgroundColor: Colors.tertiary,
              width: '100%',
              padding: 20,
              borderRadius: 10,
              gap: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: Colors.secondary, fontWeight: 700, fontSize: 16}}>
              {t('screens.profile.firstName')} :
            </Text>
            <Text style={{color: Colors.white, fontSize: 14}}>
              {userDetails?.first_name}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.tertiary,
              width: '100%',
              padding: 20,
              borderRadius: 10,
              gap: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: Colors.secondary, fontWeight: 700, fontSize: 16}}>
              {t('screens.profile.lastName')} :
            </Text>
            <Text style={{color: Colors.white, fontSize: 14}}>
              {userDetails?.last_name}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.tertiary,
              width: '100%',
              padding: 20,
              borderRadius: 10,
              gap: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: Colors.secondary, fontWeight: 700, fontSize: 16}}>
              {t('screens.profile.email')} :
            </Text>
            <Text style={{color: Colors.white, fontSize: 14}}>
              {userDetails?.email}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: Colors.tertiary,
              width: '100%',
              padding: 20,
              borderRadius: 10,
              gap: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: Colors.secondary, fontWeight: 700, fontSize: 16}}>
              {t('screens.profile.language')} :
            </Text>
            <Text style={{color: Colors.white, fontSize: 14}}>
              {
                languages.filter(lang => lang.value == userDetails?.language)[0]
                  ?.label
              }
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.tertiary,
              width: '100%',
              padding: 20,
              borderRadius: 10,
              gap: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{color: Colors.secondary, fontWeight: 700, fontSize: 16}}>
              {t('screens.profile.country')} :
            </Text>
            <Text style={{color: Colors.white, fontSize: 14}}>
              {userDetails?.country}
            </Text>
          </View>
        </View>
      </View>
    </RowContainer>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  profileView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.secondary,
    padding: 10,
    marginTop: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
