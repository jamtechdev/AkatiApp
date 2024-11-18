import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Card,
  CustomText,
  GradientView,
  HeadingText,
  RowContainer,
  Skeleton,
  TextBadge,
  TextInputWithIcon,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import {booksService} from '../../_services/book.service';
import {commonServices} from '../../_services/common.service';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAuth } from '../../_store/_reducers/auth';

export default function SearchScreen() {
  const [searchTerms, setSearchTerms] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [foundItems, setFoundItems] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [hotSearch, setHotSearch] = useState([]);
  const [bookCategories, setBookCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showVariant, setShowVariant] = useState(true);
  const [selectedCatName, setSelectedCatName] = useState('All');
  const {loggedIn, language } = useSelector(getAuth)
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [suggestion, setSuggestion] = useState([])
  const [onFocus, setOnFocus] = useState(false)
  const {t} = useTranslation();

  useEffect(() => {
    getBookCategories();
    handleGetHistory();
    getBookSuggestions();
  }, []);

  useEffect(() => {
    if (searchTerms === '') {
      setFoundItems([]);
    }
  }, [searchTerms]);

  useEffect(() => {
    if (selectedCatName !== 'All') {
      handleSearch();
    }
  }, [selectedCatName]);

  useEffect(() => {
    if (searchTerms.length > 0) {
      // Filter books based on search text
       const filteredSuggestions = bookSuggestions.filter(book =>
          book.title.toLowerCase().includes(searchTerms.toLowerCase()) &&
          book.id == language
        );
        // Limit suggestions to first 5 matches
        setSuggestion(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestion([]);
    }
  }, [searchTerms, bookSuggestions]);

  useFocusEffect(
    useCallback(() => {
      resetState();
    }, []),
  );
  const resetState = () => {
    setSearchTerms('');
    setSearchCategory('');
    setShowVariant(true);
    setShowCategories(true);
    setFoundItems([]);
    handleGetHistory();
  };

  const handleGetHistory = () => {
    commonServices
      .getHistory()
      .then(res => {
        setRecentSearch(res.data.data.mySearch);
        setHotSearch(res.data.data.hotSearch);
      })
      .catch(err => console.log(err));
  };

  const getBookSuggestions = () => {
    commonServices
      .getBookSuggestions()
      .then((res) => {
        setBookSuggestions(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getBookCategories = () => {
    commonServices
      .getBookCategories()
      .then(res => {
        setBookCategories(res.data.list);
      })
      .catch(err => console.log(err));
  };

  const handleRemoveHistory = id => {
    commonServices
      .removeHistory({history_id: id})
      .then(() => {
        handleGetHistory();
      })
      .catch(err => console.log(err));
  };

  const handleSearch = () => {
    if (searchCategory === '' && searchTerms === '') {
      return;
    }
    booksService
      .searchBooks(searchTerms, searchCategory)
      .then(res => {
        setFoundItems(res.data.data);
      })
      .catch(err => console.log(err));
    setShowVariant(false);
    setShowCategories(false);
    setSuggestion([]); // Clear suggestions after search
  };

  const renderHeader = () => (
    <View>
      {showCategories && (
        <>
          <View>
            <HeadingText>{t('screens.searching.category')}</HeadingText>
            <View style={styles.categoryContainer}>
              <TextBadge
                title={'All'}
                onPress={() => {
                  setSearchCategory('');
                  setSelectedCatName('All');
                }}
                isActive={searchCategory === ''}
              />
              {bookCategories.length > 0 ? (
                bookCategories.map((category, index) => (
                  <TextBadge
                    key={index}
                    title={category.name}
                    isActive={searchCategory === category.id}
                    onPress={() => {
                      setSearchCategory(category.id);
                      setSelectedCatName(category.name);
                    }}
                  />
                ))
              ) : (
                <>
                  <Skeleton isLoading={true} count={3} isHorizontal isBatch />
                  <Skeleton isLoading={true} count={3} isHorizontal isBatch />
                </>
              )}
            </View>
          </View>
          <View>
            <HeadingText>{t('screens.searching.hotSearch')}</HeadingText>
            <View style={styles.categoryContainer}>
              {hotSearch.length >= 0 ? (
                hotSearch.map((hot, index) => (
                  <TextBadge
                    key={index}
                    title={hot?.search_term}
                    onPress={() => setSearchTerms(hot?.search_term)}
                  />
                ))
              ) : (
                <>
                  <Skeleton isLoading={true} count={3} isHorizontal isBatch />
                  <Skeleton isLoading={true} count={3} isHorizontal isBatch />
                </>
              )}
              {hotSearch.length == 0 && (
                <CustomText>{t('screens.searching.noData')}</CustomText>
              )}
            </View>
            {recentSearch.length !== 0 && (
              <HeadingText>{t('screens.searching.recentSearch')}</HeadingText>
            )}
            <View style={{marginVertical: 10}}>
              {recentSearch.length >= 0 ? (
                recentSearch.map((search, index) => (
                  <View style={styles.recentContainer} key={index}>
                    <TouchableOpacity
                      style={{width: '85%'}}
                      onPress={() => setSearchTerms(search?.search_term)}>
                      <Text style={styles.recentSearchText}>
                        {search?.search_term}
                      </Text>
                    </TouchableOpacity>
                    <Icon
                      size={25}
                      color={Colors.white}
                      name={'close-circle-outline'}
                      onPress={() => handleRemoveHistory(search.id)}
                    />
                  </View>
                ))
              ) : (
                <Skeleton isLoading={true} count={4} isList />
              )}
              {recentSearch.length == 0 && (
                <CustomText>{t('screens.searching.noData')}</CustomText>
              )}
            </View>
          </View>
        </>
      )}
      {foundItems.length > 0 && (
        <HeadingText>{t('screens.searching.results')}</HeadingText>
      )}
    </View>
  );

  const renderItem = ({item}) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Card item={item} />
      </View>
    </View>
  );

  return (
    <RowContainer>
      <View style={{ position: 'relative', zIndex: 999}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 10,
          }}>
          <TextInputWithIcon
            iconName={'search'}
            placeholder={t('screens.searching.searchPlaceholder')}
            placeholderTextColor={Colors.darkGray}
            onChangeText={setSearchTerms}
            value={searchTerms}
            style={{flex: 1}}
            onIconPress={handleSearch}
            onFocus={() =>  setOnFocus(true)}
            onBlur={() =>  setOnFocus(false)}
          />
          <GradientView
            onPress={handleSearch}
            style={{
              height: 35,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
            }}>
            <Icon
              size={30}
              color={Colors.white}
              name={showCategories ? 'filter' : 'filter-off'}
              onPress={() => setShowCategories(prev => !prev)}
            />
          </GradientView>
        </View>

        {suggestion.length > 0 && onFocus && (
          <View style={styles.suggestionContainer}>
            {suggestion.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchTerms(item.title);
                  setSuggestion([]);
                  handleSearch();
                  setOnFocus(false)
                }}>
                <Text style={styles.suggestionText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FlatList
        ListHeaderComponent={renderHeader}
        data={foundItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    padding: 10,
    borderRadius: 50,
    color: Colors.white,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  searchIcon: {
    width: 37,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: Colors.tertiary,
  },
  filterIcons: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginRight: 10,
  },
  categoryContainer: {
    flexWrap: 'wrap',
    gap: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
  recentContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.darkGray,
    borderRadius: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  recentSearchText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    position: 'relative',
  },
  suggestionContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.tertiary,
    borderRadius: 15,
    borderWidth: 2,
    borderColor:Colors.secondary,
    zIndex: 1000,
    elevation: 5,
    marginTop: 5,
    paddingVertical: 10
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  suggestionText: {
    color: Colors.white,
    fontSize: 14,
  },
});
