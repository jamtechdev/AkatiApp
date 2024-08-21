import {View, Text} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../_utils/GlobalStyle';
import {useTranslation} from 'react-i18next';
export default function NoDataFound({description}) {
  const {t} = useTranslation();
  return (
    <View
      style={{
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: Colors.black,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center',
        gap: 20,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <MaterialIcons
          name={'error-outline'}
          size={45}
          color={Colors.secondary}
        />
      </View>
      <Text
        style={{color: Colors.white, textAlign: 'center', color: Colors.gray}}>
        {description || t('screens.language.dataNull')}
      </Text>
    </View>
  );
}
