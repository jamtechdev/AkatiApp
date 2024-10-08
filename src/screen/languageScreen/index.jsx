import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Checkbox,
  HeadingText,
  RowContainer,
  Skeleton,
  TouchableText,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth, getLanguage, languageSet} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {getLanguageCode} from '../../_helpers';
import {useAppContext} from '../../_customContext/AppProvider';
import {useTranslation} from 'react-i18next';

export default function LanguageScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const [languages, setLanguages] = useState();
  const language = useSelector(getLanguage);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  useEffect(() => {
    commonServices
      .getLanguage()
      .then(res => {
        setLanguages(res.data.list);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleOnChange = lang => {
    const {id, language_title} = lang;
    showLoader();
    const data = {
      language: id,
    };
    const local = getLanguageCode(language_title);
    commonServices
      .setLanguage(data)
      .then(res => {
        if (res.data.success) {
          dispatch(languageSet(id));
          showToast(t('screens.alert.languageChange'), 'success');
        }
      })
      .catch(err => {
        console.log(err);
        showToast(err, 'error');
      })
      .finally(() => hideLoader());
  };

  const renderLanguageItem = ({item}) => {
    return (
      <View style={styles.CheckList}>
        <TouchableText onPress={() => handleOnChange(item)}>
          {item?.language_title}
        </TouchableText>
        <Checkbox
          checked={item.id == language}
          onChange={() => handleOnChange(item)}
        />
      </View>
    );
  };

  return (
    <RowContainer>
      <View style={{paddingBottom: 20}}>
        <HeadingText>{t('screens.language.title')} </HeadingText>
      </View>
      {languages && languages.length > 0 ? (
        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Skeleton isLoading={true} isList />
      )}
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  CheckList: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: Colors.secondary,
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
});
