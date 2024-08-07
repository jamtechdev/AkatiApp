import {View, Text, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  SkeletonLoader,
  CustomStarRating,
  HorizontalScrollView,
  Skeleton,
} from '../../components';
import {booksService} from '../../_services/book.service';
import {useFocusEffect} from '@react-navigation/native';
import {getLanguage} from '../../_store/_reducers/auth';
import {useSelector} from 'react-redux';

export default function DiscoverScreen() {
  const [loading, setLoading] = useState(true);
  const [newBooks, setNewBooks] = useState([]);
  const [mustReadBooks, setMustReadBooks] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [alsoLikeBooks, setAlsoLikeBooks] = useState([]);
  const [categoryBook, setCategoryBook] = useState([]);
  const language = useSelector(getLanguage);
  useFocusEffect(
    useCallback(() => {
      fetchLibraryBook();
    }, [language]),
  );

  const fetchLibraryBook = async () => {
    try {
      const libraryRes = await booksService.getLibraryBooks();
      setLibraryBooks(libraryRes.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newBooksRes = await booksService.getNewBooksList();
        setNewBooks(newBooksRes.data.data);

        const mustReadRes = await booksService.getMustReadBooks();
        setMustReadBooks(mustReadRes.data.data);

        const alsoLikeRes = await booksService.getAlsoLikeBooks();
        setAlsoLikeBooks(alsoLikeRes.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
      try {
        const categoryRes = await booksService.getBookCategory();
        setCategoryBook(categoryRes.data.category_List);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const renderCategory = ({item}) => (
    <View key={item.title} style={{marginVertical: 10}}>
      <HeadingText>{item.title}</HeadingText>
      <HorizontalScrollView data={item.data} />
    </View>
  );

  const renderHorizontalScrollView = (data, key, isCircle = false) =>
    loading ? (
      <Skeleton
        isLoading={true}
        count={3}
        numColumns={3}
        isCircleCard={isCircle}
      />
    ) : data.length === 0 ? (
      key !== 'libraryBooks' && <Text>No data found</Text>
    ) : (
      <HorizontalScrollView data={data} isCircle={isCircle} />
    );

  return (
    <RowContainer>
      <FlatList
        data={[
          {
            title: 'From Your Library',
            data: libraryBooks,
            key: 'libraryBooks',
            isCircle: true,
          },
          {title: 'New In Akati', data: newBooks, key: 'newBooks'},
          {title: 'Must Read', data: mustReadBooks, key: 'mustReadBooks'},
          {
            title: 'You may also like',
            data: alsoLikeBooks,
            key: 'alsoLikeBooks',
          },
        ]}
        renderItem={({item}) => (
          <View>
            {item.key == 'libraryBooks' && item?.data?.length == 0 ? null : (
              <HeadingText>{item.title}</HeadingText>
            )}
            {renderHorizontalScrollView(item.data, item.key, item.isCircle)}
          </View>
        )}
        ListFooterComponent={() =>
          loading ? (
            <Skeleton isLoading={true} count={3} numColumns={3} />
          ) : (
            <FlatList
              data={categoryBook.filter(
                category =>
                  category.data &&
                  category.data.length > 0 &&
                  category.title !== 'Must Read',
              )}
              renderItem={renderCategory}
              keyExtractor={(item, index) => item.title + index}
            />
          )
        }
        keyExtractor={(item, index) => item.key + index}
        showsVerticalScrollIndicator={false}
      />
    </RowContainer>
  );
}
