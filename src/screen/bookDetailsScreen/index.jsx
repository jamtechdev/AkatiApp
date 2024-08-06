import React, {useEffect, useState} from 'react';
import {
  Button,
  CustomStarRating,
  GradientView,
  RowContainer,
  TabSwitcher,
} from '../../components';
import {Image, ScrollView, Text, View, StyleSheet, Share} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import {IMAGE_API_URL} from '../../_constant';
import {booksService} from '../../_services/book.service';
import {useAppContext} from '../../_customContext/AppProvider';

function BookDetailsScreen({navigation, route}) {
  const [chapters, setChpaters] = useState([]);
  const [rating, setRating] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const {showToast, showLoader, hideLoader} = useAppContext();
  const {params} = route;
  const {bookId, bookItem} = params;
  const {
    BookDetails,
    categories,
    category_id,
    cover_image,
    rating_average,
    ratings,
  } = bookItem;
  console.log(rating);
  useEffect(() => {
    if (BookDetails) {
      const bookData = {
        book_id: bookId,
        language: BookDetails?.lng_id,
      };

      booksService
        .getBookChapters(bookData)
        .then(response => {
          setChpaters(response.data.chapters);
        })
        .catch(error => {
          console.log(error);
        });
    }
    getLibraryBooks();
    setRating(ratings);
    setRatingAverage(rating_average);
  }, [BookDetails, route]);

  useEffect(() => {
    if (ratings) {
      setRating(ratings);
      setRatingAverage(rating_average);
    }
  }, [ratings]);

  const getLibraryBooks = () => {
    booksService
      .getLibraryBooks()
      .then(res => {
        for (let i = 0; i <= res.data.data.length; i++) {
          if (BookDetails.book_id == res?.data?.data[i]?.BookDetails?.book_id) {
            setIsInLibrary(true);
          }
        }
      })
      .catch(err => console.log(err));
  };
  const handleAddToLibrary = bookId => {
    booksService
      .addToLibrary({book_id: bookId})
      .then(res => {
        setIsInLibrary(true);
        showToast(res.data.message);
      })
      .catch(err => console.log(err));
  };
  const handleRemoveFromLibrary = bookId => {
    console.log(bookId);
    const bookData = {
      book_id: [bookId.toString()],
      select_all: 0,
    };
    booksService
      .removeFromLibrary(bookData)
      .then(res => {
        setIsInLibrary(false);
        showToast(res.data.message);
      })
      .catch(err => console.log(err));
  };

  const handleShare = book => {
    Share.share({
      title: book.title,
      text: `Check out this page for read ${book.title} by ${book.author}. for more book please download and explore thousands of books.for android please check this: https://play.google.com/store/apps/details?id=com.akati, and for iOS please check this : https://apps.apple.com/in/app/akati/id1633617962  or for web please check the https://app.feupsontec.com`,
      url: 'https://app.feupsontec.com',
    })
      .then(() => console.log('Successfully shared'))
      .catch(error => console.log('Error sharing', error));
  };

  const renderTabContent = key => {
    switch (key) {
      case 'Reviews':
        return (
          <View style={styles.tabContent}>
            {rating &&
              rating.length > 0 &&
              rating.map((item, index) => (
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 15,
                    marginBottom: 20,
                    borderRadius: 15,
                  }}
                  key={index}>
                  <View style={styles.reviewHeader}>
                    <Image
                      style={styles.reviewImage}
                      source={{
                        uri: 'https://feupsontec.com/storage/book-front-cover/63ad35ebb2492.jpeg',
                      }}
                      resizeMode="stretch"
                    />
                    <View style={styles.reviewHeaderTextContainer}>
                      <Text style={styles.reviewAuthor}>
                        George R.R. Martin
                      </Text>
                      <View style={styles.reviewRating}>
                        <CustomStarRating rate={item.rating} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.reviewDivider}>
                    <Text style={styles.reviewDescription}>{item.message}</Text>
                  </View>
                </View>
              ))}
          </View>
        );
      case 'Chapters':
        return (
          <View style={styles.tabContent}>
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter, index) => (
                <View style={{padding:15, borderWidth:1, borderColor:Colors.primary,borderRadius:5, marginBottom:10, backgroundColor:Colors.primary}} key={index}>
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <Text style={{color:Colors.white, fontWeight:600, marginBottom:5}}>Chapter 1</Text>
                {chapter.unlock == 1 && (
                      <Icons name={'lock'} size={15} color={Colors.secondary} />
                    )}
                </View>
                  <Text style={styles.chapterText}>
                    {chapter.chapter_details.title}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.description}>No chapters available.</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const tabs = [
    {
      key: 'Reviews',
      title: 'Reviews',
      content: renderTabContent('Reviews'),
    },
    {
      key: 'Chapters',
      title: 'Chapters',
      content: renderTabContent('Chapters'),
    },
  ];

  return (
    <RowContainer style={{paddingHorizontal: 0, paddingTop: 0, flex: 1}}>
      <View style={{flex: 1}}>
        <GradientView
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icons name={'long-arrow-left'} size={20} color={'white'} />
        </GradientView>
        <GradientView style={styles.shareButton} onPress={handleShare}>
          <Icons name={'share-alt'} size={20} color={'white'} />
        </GradientView>
        <View style={{position: 'relative', zIndex: -1}}>
          <Image
            source={{uri: IMAGE_API_URL + cover_image}}
            style={{width: '100%', height: 200}}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // This simulates the blur effect
              opacity: 0.8,
            }}></View>
        </View>
        <View style={styles.centeredImage}>
          <Image
            style={styles.scrollMainImage}
            source={{uri: IMAGE_API_URL + cover_image}}
            resizeMode="stretch"
          />
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{paddingVertical: 20, gap: 10, paddingHorizontal: 10}}>
            <Text
              style={{color: Colors.white, fontWeight: '600', fontSize: 22}}>
              {BookDetails?.title}
            </Text>
            <Text
              style={{color: Colors.darkGray, fontWeight: '400', fontSize: 12}}>
              Author: {BookDetails?.author}
            </Text>
            <View>
              <CustomStarRating rate={ratingAverage} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{width: '50%', paddingHorizontal: 5}}>
                <Button
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    backgroundColor: Colors.white,
                  }}
                  textStyle={{color: Colors.secondary, fontWeight: '400'}}
                  gradient={false}
                  title={'Start Reading'}
                  onPress={() =>
                    navigation.navigate('Reading', {bookId: bookId})
                  }
                />
              </View>
              <View style={{width: '50%', paddingHorizontal: 5}}>
                {!isInLibrary ? (
                  <Button
                    style={{paddingVertical: 10, paddingHorizontal: 10}}
                    title={'Add Library'}
                    onPress={() => handleAddToLibrary(BookDetails?.book_id)}
                  />
                ) : (
                  <Button
                    style={{paddingVertical: 10, paddingHorizontal: 10}}
                    title={'Remove Library'}
                    onPress={() =>
                      handleRemoveFromLibrary(BookDetails?.book_id)
                    }
                  />
                )}
              </View>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.darkGray,
                paddingTop: 15,
                marginTop: 10,
              }}>
              <Text
                style={{
                  color: Colors.gray,
                  fontWeight: '400',
                  fontSize: 14,
                  lineHeight: 22,
                }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
            </View>
          </View>
          <TabSwitcher tabs={tabs} />
        </ScrollView>
      </View>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  centeredImage: {
    alignItems: 'center',
    marginTop: -140,
  },
  mainImage: {
    width: 200,
    height: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  scrollMainImage:{
    width: 120,
    height: 120,
    marginBottom:50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  tabContent: {
    padding: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  reviewDivider: {
    marginBottom: 5,
  },
  reviewImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  reviewHeaderTextContainer: {
    gap: 5,
  },
  reviewAuthor: {
    color: Colors.gray,
    fontWeight: '600',
    fontSize: 14,
  },
  reviewRating: {
    marginLeft: -5,
  },
  reviewDescription: {
    color: Colors.gray,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 22,
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    position: 'absolute',
    marginTop: 20,
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    position: 'absolute',
    marginTop: 20,
    right: 10,
  },
  chapterText: {
    color: Colors.gray,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 22,
  },
  description: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default BookDetailsScreen;
