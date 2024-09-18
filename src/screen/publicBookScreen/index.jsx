import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  SkeletonLoader,
  Checkbox,
  Button,
  Card,
  Skeleton,
  GradientView,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {publicService} from '../../_services/public.service';
import {getLanguage} from '../../_store/_reducers/auth';
import {useSelector} from 'react-redux';
import {useAppContext} from '../../_customContext/AppProvider';
import {useFocusEffect} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
export default function PublicBookScreen({navigation}) {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const language = useSelector(getLanguage);
  const [publicBooks, setPublicBooks] = useState();
  const {t} = useTranslation();

useEffect(()=>{
  fetchPublicBook()
},[language])

  const fetchPublicBook = () => {
    publicService
      .getPublicBooks(language)
      .then(res => {
        setPublicBooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Card item={item} />
        </View>
      </View>
    );
  };

  const filterBooksByStatus = (books, statusToFilterOut = 0) => {
    return books.filter(book => book?.status !== statusToFilterOut);
  };

  return (
    <RowContainer>
      <View style={styles.headerRow}>
        <HeadingText>{t('screens.header.discover')}</HeadingText>
      </View>

      {!publicBooks ? (
        <Skeleton isLoading={true} numColumns={2} />
      ) : publicBooks.length == 0 ? (
        <View style={styles.noData}>
          <Image
            source={require('../../images/no-book.png')}
            style={styles.imgData}
          />
          <CustomText>{t('screens.library.textLib')}</CustomText>
        </View>
      ) : (
        <FlatList
          data={filterBooksByStatus(publicBooks)}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </RowContainer>
  );
}
const styles = StyleSheet.create({
  noData: {
    marginHorizontal: 'auto',
    width: '80%',
    height: '70%',
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  imgData: {
    height: '60%',
    width: '90%',
    // marginHorizontal: 5,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: Colors.white,
    fontSize: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 5,
    borderRadius: 10,
    zIndex: 1000,
  },
  card: {
    overflow: 'hidden',
  },
  cardWithOverlay: {
    overflow: 'hidden',
    opacity: 0.6,
  },
  editModeButton: {
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
  },
});
