import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
} from '../../components';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';
import {Colors} from '../../_utils/GlobalStyle';
import {useTranslation} from 'react-i18next';

function PrivacyScreen() {
  const {showLoader, hideLoader} = useAppContext();
  const [policy, setPolicy] = useState();
  const {t} = useTranslation();

  useEffect(() => {
    // showLoader();
    commonServices
      .getPrivacyPolicy()
      .then(res => {
        setPolicy(res.data.result);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => hideLoader());
  }, []);

  const renderItem = () => (
    <CustomText style={styles.text}>{policy?.content}</CustomText>
  );

  return (
    <RowContainer style={styles.container}>
      <HeadingText>{t('screens.setting.privacy')}</HeadingText>
      <FlatList
        data={policy ? [policy] : []}
        renderItem={renderItem}
        keyExtractor={() => 'privacy'}
        ListEmptyComponent={<Skeleton isLoading={true} isLine count={20} />}
        showsVerticalScrollIndicator={false}
      />
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    paddingVertical: 20,
    color: Colors.gray,
  },
});

export default PrivacyScreen;
