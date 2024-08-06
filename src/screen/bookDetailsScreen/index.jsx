import React, {useEffect, useState} from 'react';
import {
  Button,
  CustomStarRating,
  CustomText,
  GradientView,
  RowContainer,
  TabSwitcher,
  TextBadge,
} from '../../components';
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Share,
  Animated,
} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import {IMAGE_API_URL} from '../../_constant';
import {booksService} from '../../_services/book.service';
import {useAppContext} from '../../_customContext/AppProvider';

function BookDetailsScreen({navigation, route}) {
  const [chapters, setChapters] = useState([]);
  const [rating, setRating] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [ratingStar, setRatingStar] = useState(0);
  const [reviewText, setReviewText] = useState('');
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
  useEffect(() => {
    if (BookDetails) {
      const bookData = {
        book_id: bookId,
        language: BookDetails?.lng_id,
      };

      booksService
        .getBookChapters(bookData)
        .then(response => {
          setChapters(response.data.chapters);
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

  const handleAddReview = () => {
    if (ratingStar == 0 && reviewText == '') {
      toast.error('Please select stars and enter review');
      return;
    }
    const reviewData = {
      rating: ratingStar,
      message: reviewText,
      book_id: BookDetails?.book_id,
    };
    booksService
      .addReview(reviewData)
      .then(res => {
        // setShow(false);
        setRatingStar(0);
        setReviewText('');
        // setReload(res.data);
        showToast(res.data.message);
      })
      .catch(error => {
        console.log(error);
        showToast(error.errors.message, "error");
      });
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
            {rating && rating.length == 0 && (
              <CustomText> No comments added yet</CustomText>
            )}
          </View>
        );
      case 'Chapters':
        return (
          <View style={styles.tabContent}>
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter, index) => (
                <View
                  style={{
                    padding: 15,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    borderRadius: 5,
                    marginBottom: 10,
                    backgroundColor: Colors.primary,
                  }}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.white,
                        fontWeight: 600,
                        marginBottom: 5,
                      }}>
                      Chapter {index + 1}
                    </Text>
                    {chapter.unlock != 1 && (
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

  const scrollY = new Animated.Value(0);
  const HEADER_MAX_HEIGHT = 200;
  const HEADER_MIN_HEIGHT = 120;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [220, 180],
    extrapolate: 'clamp',
  });

  const imageSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [200, 120],
    extrapolate: 'clamp',
  });
  const imagePadding = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 30],
    extrapolate: 'clamp',
  });

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
        <Animated.View style={{height: headerHeight, zIndex: -1}}>
          <Image
            source={{uri: IMAGE_API_URL + cover_image}}
            style={{width: '100%', height: '100%'}}
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
        </Animated.View>
        <View style={styles.centeredImage}>
          {/* <Image
            style={styles.scrollMainImage}
            source={{uri: IMAGE_API_URL + cover_image}}
            resizeMode="stretch"
          /> */}
          <Animated.Image
            style={[
              styles.scrollMainImage,
              {width: imageSize, height: imageSize, marginBottom: imagePadding},
            ]}
            source={{uri: IMAGE_API_URL + cover_image}}
            resizeMode="stretch"
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}>
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
              <CustomText style={{fontSize: 20}}>
                {' '}
                {parseFloat(rating_average).toFixed(1)}{' '}
                <CustomStarRating rate={ratingAverage} />{' '}
              </CustomText>
            </View>
            <CustomText> based on {ratings?.length} ratings</CustomText>
            <View>
              <CustomText> Fallowing Tags</CustomText>
              <View style={styles.categoryContainer}>
                {categories &&
                  categories.map(tag => {
                    return <TextBadge key={tag.id} title={tag.name} />;
                  })}
              </View>
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
                    navigation.navigate('Reading', {bookId: bookId, chapters : chapters})
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
                minHeight: 100,
              }}>
              <Text
                style={{
                  color: Colors.gray,
                  fontWeight: '400',
                  fontSize: 14,
                  lineHeight: 22,
                }}>
                {BookDetails?.description}
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
  scrollMainImage: {
    width: 120,
    height: 120,
    marginBottom: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  tabContent: {
    padding: 10,
    minHeight: 200,
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
  categoryContainer: {
    flexWrap: 'wrap',
    gap: 8,
    flexDirection: 'row',
    marginVertical: 10,
  },
});

export default BookDetailsScreen;
