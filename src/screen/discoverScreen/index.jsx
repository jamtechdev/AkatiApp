import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
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

export default function DiscoverScreen() {
  const data = [
    {
      id: 1,
      title: 'Card 1',
      description: 'This is card 1',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Card 2',
      description: 'This is card 2',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Card 3',
      description: 'This is card 3',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'Card 4',
      description: 'This is card 4',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const [newBooks, setNewBooks] = useState();
  const [mustReadBooks, setMustReadBooks] = useState();
  const [libraryBooks, setLibrarybooks] = useState();
  const [alsoLikeBooks, setAlsoLikeBooks] = useState();
  const [categorybook, setCategorybook] = useState([]);

  useEffect(() => {
    booksService
      .getBookCategory()
      .then(res => {
        setCategorybook(res.data.category_List);
      })
      .catch(error => {
        console.log(error);
      });
    booksService
      .getLibraryBooks()
      .then(res => {
        setLibrarybooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
    booksService
      .getNewBooksList()
      .then(res => {
        setNewBooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
    booksService
      .getMustReadBooks()
      .then(res => {
        setMustReadBooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
    booksService
      .getAlsoLikeBooks()
      .then(res => {
        setAlsoLikeBooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <RowContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <HeadingText>From Your Library </HeadingText>
          {!libraryBooks ? (
            <Skeleton isLoading={true} count={3} numColumns={3} isCircleCard />
          ) : libraryBooks.length == 0 ? (
            <Text>No books in your library</Text>
          ) : (
            <HorizontalScrollView data={libraryBooks} isCircle={true} />
          )}
        </View>
        <View>
          <HeadingText>New In Akati </HeadingText>
          {!newBooks ? (
            <Skeleton isLoading={true} count={3} numColumns={3} />
          ) : newBooks.length == 0 ? (
            <Text>No data found</Text>
          ) : (
            <HorizontalScrollView data={newBooks} />
          )}
        </View>
        <View>
          <HeadingText>Must Read </HeadingText>
          {!mustReadBooks ? (
            <Skeleton isLoading={true} count={3} numColumns={3} />
          ) : mustReadBooks.length == 0 ? (
            <Text>No data found</Text>
          ) : (
            <HorizontalScrollView data={mustReadBooks} />
          )}
        </View>
        <View>
          <HeadingText>You may also like</HeadingText>
          {/* <Skeleton isLoading={true}  count={2} numColumns={2}/> */}
          <HorizontalScrollView data={alsoLikeBooks} />
        </View>
        <View>
          {categorybook?.length === 0 ? (
            <Text>No data found</Text>
          ) : !categorybook?.length ? (
            <Skeleton isLoading={true} count={3} numColumns={3} />
          ) : (
            categorybook
              .filter(
                category =>
                  category.data &&
                  category.data.length > 0 &&
                  category.title != 'Must Read',
              )
              .map((category, index) => (
                <View key={index} className="my-4">
                  <HeadingText>{category.title}</HeadingText>

                  <HorizontalScrollView data={category.data} />
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </RowContainer>
  );
}
