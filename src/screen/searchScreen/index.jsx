import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import React, {useState} from 'react';
import {
  Card,
  GradientView,
  HeadingText,
  RowContainer,
  TextBadge,
} from '../../components';
import {TextInput} from 'react-native-gesture-handler';
import {Colors} from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import {booksService} from '../../_services/book.service';

const categories = [
  'Happy',
  'Sad',
  'Exciting',
  'Mystery',
  'Fantasy',
  'Sci-Fi',
  'Romance',
  'Thriller',
];

export default function SearchScreen() {
  const [searchTerms, setSearchTerms] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [foundItems, setFoundItems] = useState();
  const handleSearch = () => {
    console.log('object');
    booksService
      .searchBooks(searchTerms, searchCategory)
      .then(res => {
        setFoundItems(res.data.data);
      })
      .catch(err => console.log(err));
  };
  return (
    <RowContainer>
      <View>
        <GradientView onPress={handleSearch}>
          <Icon size={25} color={Colors.white} name={'search'} />
        </GradientView>

        <TextInput
          placeholder="Which book would you like to read today..."
          style={styles.searchBar}
          placeholderTextColor={Colors.darkGray}
          onChangeText={e => setSearchTerms(e)}
        />
      </View>
      <ScrollView>
        <View>
          <HeadingText>Select Book Categories</HeadingText>
          <View style={styles.categoryContainer}>
            {categories.map((category, index) => (
              <TextBadge
                key={index}
                title={category}
                onPress={() => {
                  setSearchCategory(category);
                  handleSearch();
                }}
              />
            ))}
          </View>
        </View>
        <View>
          <HeadingText>Hot search</HeadingText>
          <View style={styles.categoryContainer}>
            {categories.map((category, index) => (
              <TextBadge
                key={index}
                title={category}
                onPress={() => {
                  setSearchCategory(category);
                  handleSearch();
                }}
              />
            ))}
          </View>
        </View>
        <View>
          <HeadingText>Recent search</HeadingText>
          <View style={{marginVertical: 10}}>
            {categories.map((category, index) => (
              <View style={styles.RecentContainer} key={index}>
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}>
                  {category}
                </Text>
                <Icon
                  size={25}
                  color={Colors.white}
                  name={'close-circle-outline'}
                />
              </View>
            ))}
          </View>
        </View>
        {foundItems && (
          <View>
            <HeadingText>Search Results </HeadingText>
            <FlatList
              data={foundItems}
              renderItem={({item}) => <Card item={item} />}
              keyExtractor={(item, index) => index}
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
    padding: 15,
    borderRadius: 50,
    color: Colors.white,
    paddingRight: 50,
    marginBottom: 10,
  },
  searchIcon: {
    width: 37,
    height: 35,
    // backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    right: 8,
    top: 5,
    bottom: 0,
    margin: 'auto',
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
