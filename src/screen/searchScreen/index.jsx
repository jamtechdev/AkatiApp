import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Card,
  CustomText,
  GradientView,
  HeadingText,
  RowContainer,
  TextBadge,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import {booksService} from '../../_services/book.service';
import {commonServices} from '../../_services/common.service';

export default function SearchScreen() {
  const [searchTerms, setSearchTerms] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [foundItems, setFoundItems] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [hotSearch, setHotSearch] = useState([]);
  const [bookCategories, setBookCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  useEffect(() => {
    getBookCategories();
    handleGetHistory();
  }, []);

  const handleGetHistory = () => {
    commonServices
      .getHistory()
      .then(res => {
        setRecentSearch(res.data.data.mySearch);
        setHotSearch(res.data.data.hotSearch);
      })
      .catch(err => console.log(err));
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
      .then(res => {
        handleGetHistory();
      })
      .catch(err => console.log(err));
  };

  const handleSearch = () => {
    booksService
      .searchBooks(searchTerms, searchCategory)
      .then(res => {
        setFoundItems(res.data.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <RowContainer>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Which book would you like to read today..."
          placeholderTextColor={Colors.darkGray}
          onChangeText={e => setSearchTerms(e)}
        />
        <GradientView onPress={handleSearch} style={[styles.searchIcon]}>
          <Icons size={25} color={Colors.white} name={'search'} />
        </GradientView>
      </View>
      <ScrollView>
        <View
          style={{flexDirection: 'row', gap: 20, justifyContent: 'flex-end'}}>
          <CustomText> categories : All</CustomText>
          <Icon
            size={25}
            color={Colors.white}
            name={showCategories ? 'filter' : 'filter-off'}
            onPress={() => setShowCategories(prev => !prev)}
          />
        </View>
        {showCategories && (
          <>
            <View>
              <HeadingText>Categories</HeadingText>
              <View style={styles.categoryContainer}>
                <TextBadge
                  title={'All'}
                  onPress={() => {
                    setSearchCategory('');
                    handleSearch();
                  }}
                  isActive={searchCategory==''}
                />
                {bookCategories &&
                  bookCategories.map((category, index) => (
                    <TextBadge
                      key={index}
                      title={category.name}
                      isActive={searchCategory== category.id}
                      onPress={() => {
                        setSearchCategory(category.id);
                        handleSearch();
                      }}
                      
                    />
                  ))}
              </View>
            </View>
            <View>
              <HeadingText>Hot search</HeadingText>
              <View style={styles.categoryContainer}>
                {hotSearch &&
                  hotSearch.map((hot, index) => (
                    <TextBadge
                      key={index}
                      title={hot?.search_term}
                      onPress={() => {
                        // setSearchCategory(hot?.search_term);
                        // handleSearch();
                      }}
                    />
                  ))}
              </View>
            </View>
            <View>
              <HeadingText>Recent search</HeadingText>
              <View style={{marginVertical: 10}}>
                {recentSearch &&
                  recentSearch.map((search, index) => (
                    <View style={styles.RecentContainer} key={index}>
                      <Text
                        style={{
                          color: Colors.white,
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        {search?.search_term}
                      </Text>
                      <Icon
                        size={25}
                        color={Colors.white}
                        name={'close-circle-outline'}
                        onPress={() => handleRemoveHistory(search.id)}
                      />
                    </View>
                  ))}
              </View>
            </View>
          </>
        )}
        {foundItems.length > 0 && (
          <View>
            <HeadingText>Search Results </HeadingText>
            <FlatList
              data={foundItems}
              renderItem={({item}) => <Card item={item} />}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.row}
            />
          </View>
        )}
      </ScrollView>
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
  categoryContainer: {
    flexWrap: 'wrap',
    gap: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
  RecentContainer: {
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
});
