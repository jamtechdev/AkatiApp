import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {CustomText, RowContainer, TouchableText} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {useToast} from '../../_customHook';

export default function SettingScreen({navigation}) {
  const [showToast, ToastComponent] = useToast();
  return (
    <RowContainer>
      <View>
        <TouchableText
          style={styles.text}
          onPress={() => showToast('Already Updated', 'info')}>
          Check For Updates
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('Terms')}>
          Terms & Conditions
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('')}>
          Privacy & Policy
        </TouchableText>
        <TouchableText
          style={styles.text}
          onPress={() => navigation.navigate('')}>
          Delete Account
        </TouchableText>
      </View>
      {ToastComponent}
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
