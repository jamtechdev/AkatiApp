import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {ContainerCenter, CustomText, RowContainer} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';

export default function SettingScreen() {
  return (
    <RowContainer>
      <View>
        <CustomText style={styles.text}>Check For Updates</CustomText>
        <CustomText style={styles.text}>Terms & Conditions</CustomText>
        <CustomText style={styles.text}>Privacy & Policy</CustomText>
        <CustomText style={styles.text}>Delete Account</CustomText>
      </View>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  text: {
    margin: 5,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
  },
});
