import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CustomText,
  GradientView,
  HeadingText,
  RowContainer,
  Skeleton,
  TextBadge,
} from '../../components';
import { Colors } from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import { booksService } from '../../_services/book.service';
import { commonServices } from '../../_services/common.service';
import {useFocusEffect} from '@react-navigation/native';

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

  useEffect(() => {
    getBookCategories();
    handleGetHistory();
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


  useFocusEffect(
    useCallback(() => {
      resetState()
    }, []),
  );
  const resetState =() =>{
    setSearchTerms('')
    setSearchCategory('')
    setShowVariant(true)
    setShowCategories(true)
    setFoundItems([])
  }

  const handleGetHistory = () => {
    commonServices.getHistory().then((res) => {
      setRecentSearch(res.data.data.mySearch);
      setHotSearch(res.data.data.hotSearch);
    }).catch((err) => console.log(err));
  };

  const getBookCategories = () => {
    commonServices.getBookCategories().then((res) => {
      setBookCategories(res.data.list);
    }).catch((err) => console.log(err));
  };

  const handleRemoveHistory = (id) => {
    commonServices.removeHistory({ history_id: id }).then(() => {
      handleGetHistory();
    }).catch((err) => console.log(err));
  };

  const handleSearch = () => {
    if (searchCategory === '' && searchTerms === '') {
      return;
    }
    booksService.searchBooks(searchTerms, searchCategory).then((res) => {
      setFoundItems(res.data.data);
    }).catch((err) => console.log(err));
    setShowVariant(false);
  };

  const renderHeader = () => (
    <View>
   
      {showCategories && (
        <View>
          <HeadingText>Categories</HeadingText>
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
      )}
      {showVariant && (
        <View>
          <HeadingText>Hot search</HeadingText>
          <View style={styles.categoryContainer}>
            {hotSearch.length > 0 ? (
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
          </View>
          <HeadingText>Recent search</HeadingText>
          <View style={{ marginVertical: 10 }}>
            {recentSearch.length > 0 ? (
              recentSearch.map((search, index) => (
                <View style={styles.recentContainer} key={index}>
                  <TouchableOpacity
                    style={{ width: '85%' }}
                    onPress={() => setSearchTerms(search?.search_term)}
                  >
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
          </View>
        </View>
      )}
      {foundItems.length > 0 && <HeadingText>Search Results</HeadingText>}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Card item={item} />
      </View>
    </View>
  );

  return (
    <RowContainer>
       <View style={styles.searchBar}>
        <TextInput
          style={{ color: Colors.white , width:'85%'}}
          placeholder="Which book would you like to read today..."
          placeholderTextColor={Colors.darkGray}
          onChangeText={setSearchTerms}
          value={searchTerms}
        />
        <GradientView onPress={handleSearch} style={styles.searchIcon}>
          <Icons size={25} color={Colors.white} name={'search'} />
        </GradientView>
      </View>
      <View style={styles.filterContainer}>
        <CustomText style={{ fontWeight: '600', fontSize: 20 }}>Search Terms</CustomText>
        <View style={styles.filterIcons}>
          <Icon
            size={25}
            color={Colors.white}
            name={showCategories ? 'filter' : 'filter-off'}
            onPress={() => setShowCategories((prev) => !prev)}
          />
          <Icon
            size={25}
            color={Colors.white}
            name={showVariant ? 'filter-variant' : 'filter-variant-remove'}
            onPress={() => setShowVariant((prev) => !prev)}
          />
        </View>
      </View>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={foundItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        // ListEmptyComponent={<CustomText>No data found</CustomText>}
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
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-end',
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
});
