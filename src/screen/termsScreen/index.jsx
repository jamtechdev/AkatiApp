import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  CustomHeader,
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
} from '../../components';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';
import {Colors} from '../../_utils/GlobalStyle';
import {useTranslation} from 'react-i18next';

function TermsScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const [terms, setTerms] = useState();
  const {t} = useTranslation();

  useEffect(() => {
    // showLoader();
    commonServices
      .getTermsConditions()
      .then(res => {
        setTerms(res.data.result);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => hideLoader());
  }, []);

  const renderItem = () => (
    <CustomText style={styles.text}>{terms?.content}</CustomText>
  );

  return (
    <RowContainer style={styles.container}>
      <HeadingText>{t('screens.setting.terms')}</HeadingText>
      <FlatList
        data={terms ? [terms] : []}
        renderItem={renderItem}
        keyExtractor={() => 'terms'}
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

export default TermsScreen;
