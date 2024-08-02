import React, {useEffect, useState} from 'react';
import {HeadingText, RowContainer} from '../../components';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import avatar from '../../images/avtar.png';
import {Colors} from '../../_utils/GlobalStyle';
import {authService} from '../../_services/auth.service';
function ProfileScreen() {
  const [userDetails, setUserDetails] = useState();

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
      <HeadingText>Profile </HeadingText>
      <View style={styles.profileView}>
        <Image
          source={userDetails?.avatar_url ? userDetails?.avatar_url : avatar}
          style={styles.avatar}
        />
        <TextInput
          style={styles.input}
          value={
            userDetails?.first_name == userDetails?.last_name
              ? userDetails?.first_name
              : `${userDetails?.first_name} ${userDetails?.last_name}`
          }
          readOnly
        />
        <TextInput style={styles.input} value={userDetails?.email} readOnly />
        <TextInput style={styles.input} value={userDetails?.country} readOnly />
        <TextInput
          style={styles.input}
          value={
            languages.filter(lang => lang.value == userDetails?.language)[0]
              .label
          }
          readOnly
        />
      </View>
    </RowContainer>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  profileView: {
    backgroundColor: Colors.tertiary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    height: '25%',
    width: '30%',
    borderRadius: 50,
    marginVertical: 10,
  },
  input: {
    border: 1,
    borderColor: Colors.secondary,
    borderWidth: 2,
    width: '80%',
    marginVertical: 5,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 20,
  },
});
