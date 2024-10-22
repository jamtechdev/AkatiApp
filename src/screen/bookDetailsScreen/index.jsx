import React, {useEffect, useState} from 'react';
import {
  BottomDrawer,
  Button,
  Checkbox,
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
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import {IMAGE_API_URL} from '../../_constant';
import {booksService} from '../../_services/book.service';
import {useAppContext} from '../../_customContext/AppProvider';
import NoDataFound from '../../components/NoDataFound';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {getAuth, getLanguage} from '../../_store/_reducers/auth';
import {publicService} from '../../_services/public.service';
import {moderateVerticalScale} from 'react-native-size-matters';

function BookDetailsScreen({navigation, route}) {
  const {loggedIn} = useSelector(getAuth);
  const language = useSelector(getLanguage);
  const [chapters, setChapters] = useState([]);
  const [rating, setRating] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [ratingStar, setRatingStar] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isErotic, setIsErotic] = useState(false);
  const {showToast, showLoader, hideLoader} = useAppContext();
  const {t} = useTranslation();
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
    if (categories) {
      // Check if there is a category with name 'Erotic'
      const isCategoryErotic = categories.find(cat => cat.name === 'Erotic');
      setIsErotic(!!isCategoryErotic); // Set to true or false based on the presence of the category
    }
  }, [categories]);

  useEffect(() => {
    if (BookDetails) {
      const bookData = {
        book_id: bookId,
        language: BookDetails?.lng_id,
      };
      if (!loggedIn) {
        setRating(ratings);
        publicService
          .getPublicBookChapters(bookId, language)
          .then(response => {
            setChapters(response.data.chapters);
          })
          .catch(error => {
            console.log(error);
          });
        return;
      }
      getLibraryBooks();
      fetchBookReview();
      booksService
        .getBookChapters(bookData)
        .then(response => {
          setChapters(response.data.chapters);
        })
        .catch(error => {
          console.log(error);
        });
    }
    setRatingAverage(rating_average);
  }, [BookDetails, route]);

  const fetchBookReview = () => {
    booksService
      .getBookReview(bookId)
      .then(response => {
        setRating(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

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
    const title = BookDetails.title;
    const message = `Book Name : ${title}  \n\nCheck out this page for reading "${BookDetails.title}" by "${BookDetails.author}". For more books, please download and explore thousands of titles. \n\nFor Android, check this: https://play.google.com/store/apps/details?id=com.akati \nFor iOS, check this: https://apps.apple.com/in/app/akati/id1633617962 \nFor web, visit: https://app.feupsontec.com`;
    Share.share({
      title: title,
      message: message,
      url: 'https://app.feupsontec.com',
    })
      .then(result => {
        if (result.action === Share.sharedAction) {
          console.log('Successfully shared');
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      })
      .catch(error => console.log('Error sharing', error));
  };

  const handleAddReview = () => {
    if (ratingStar == 0 && reviewText == '') {
      showToast(t('screens.review.warning'), 'error');
      return;
    }
    showLoader();
    const reviewData = {
      rating: ratingStar,
      message: reviewText,
      book_id: BookDetails?.book_id,
    };
    booksService
      .addReview(reviewData)
      .then(res => {
        fetchBookReview();
        setShowModel(false);
        setRatingStar(0);
        setReviewText('');
        showToast(res.data.message);
      })
      .catch(error => {
        console.log(error);
        showToast(error.errors.message, 'error');
      })
      .finally(() => hideLoader());
  };

  const renderTabContent = key => {
    switch (key) {
      case 'Reviews':
        return (
          <View style={styles.tabContent}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}>
              {loggedIn && (
                <GradientView
                  style={styles.addButton}
                  onPress={() => setShowModel(true)}>
                  <CustomText style={{fontSize: 15, fontWeight: 600}}>
                    {t('screens.bookDetails.addReview')}
                  </CustomText>
                  <Icons name={'plus-circle'} size={15} color={Colors.white} />
                </GradientView>
              )}
            </View>
            {rating &&
              rating.length > 0 &&
              rating
                .slice()
                .reverse()
                .map((item, index) => (
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
                        source={{uri: item?.user?.profile_image_url_web}}
                        resizeMode="stretch"
                      />
                      <View style={styles.reviewHeaderTextContainer}>
                        <Text style={styles.reviewAuthor}>
                          {item?.user?.first_name} {item?.user?.last_name}
                        </Text>
                        <View style={styles.reviewRating}>
                          <CustomStarRating rate={item.rating} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.reviewDivider}>
                      <Text style={styles.reviewDescription}>
                        {item.message}
                      </Text>
                    </View>
                  </View>
                ))}
            {rating && rating.length == 0 && (
              <NoDataFound description={t('screens.reading.noComment')} />
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
                      {t('screens.bookDetails.chapter')} {index + 1}
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
              <NoDataFound description={t('screens.bookDetails.noChapter')} />
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
      title: t('screens.bookDetails.reviews'),
      content: renderTabContent('Reviews'),
    },
    {
      key: 'Chapters',
      title: t('screens.bookDetails.chapters'),
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

  const handleRatingChange = newRating => {
    setRatingStar(newRating);
  };

  const handleChange = text => {
    setReviewText(text);
  };

  const routeReadingScreen = () => {
    if (!isCheck && isErotic) {
      setErrorText(t('screens.bookDetails.checkBox'));
      return;
    }
    if (!chapters || (chapters?.length == 0 && !BookDetails)) {
      showToast(t('screens.bookDetails.noChapterAdded'), 'error');
      return;
    }
    navigation.navigate('Reading', {
      bookId: bookId,
      chapters: chapters,
      BookDetails: BookDetails,
      categories: categories,
    });
    setIsCheck(false);
    setIsVisible(false);
  };

  return (
    <RowContainer style={{paddingHorizontal: 0, paddingTop: 0, flex: 1}}>
      <View style={{flex: 1}}>
        {/* <GradientView
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icons name={'long-arrow-left'} size={20} color={'white'} />
        </GradientView> */}
        <View style={{position: 'absolute', top: 15}}>
          <LinearGradient
            colors={['rgba(255, 81, 47, 1)', 'rgba(221, 36, 118, 1)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={GlobalStyles.backButton}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={GlobalStyles.backButton}>
              <Icons name={'long-arrow-left'} size={25} color={'white'} />
            </Pressable>
          </LinearGradient>
        </View>
        <View style={{position: 'absolute', top: 15, right: 60}}>
          <LinearGradient
            colors={['rgba(255, 81, 47, 1)', 'rgba(221, 36, 118, 1)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={GlobalStyles.rightButton}>
            <Pressable onPress={handleShare} style={GlobalStyles.rightButton}>
              <Icons name={'share-alt'} size={20} color={'white'} />
            </Pressable>
          </LinearGradient>
        </View>

        {/* 
        <GradientView style={styles.shareButton} onPress={handleShare}>
          <Icons name={'share-alt'} size={20} color={'white'} />
        </GradientView> */}
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
              {t('screens.bookDetails.bookAuthor')}: {BookDetails?.author}
            </Text>

            {!rating_average ? null : (
              <View style={{marginVertical: 10, gap: 5}}>
                <View
                  style={{
                    color: Colors.secondary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <Text
                    style={{
                      color: Colors.secondary,
                      fontSize: 20,
                      fontWeight: 600,
                    }}>
                    {parseFloat(rating_average).toFixed(1)}
                  </Text>
                  <CustomStarRating rate={ratingAverage} />
                </View>
                <CustomText style={{color: Colors.darkGray, fontSize: 16}}>
                  {t('screens.bookDetails.based')} {ratings?.length}{' '}
                  {t('screens.bookDetails.rating')}
                </CustomText>
              </View>
            )}

            <View>
              <CustomText>{t('screens.bookDetails.tags')}</CustomText>
              <View style={styles.categoryContainer}>
                {categories &&
                  categories.map(tag => {
                    return <TextBadge key={tag.id} title={tag.name} />;
                  })}
              </View>
            </View>
            {loggedIn && (
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
                    title={t('screens.bookDetails.reading')}
                    onPress={() =>
                      isErotic
                        ? setIsVisible(prev => !prev)
                        : routeReadingScreen()
                    }
                  />
                </View>
                <View style={{width: '50%', paddingHorizontal: 5}}>
                  {!isInLibrary ? (
                    <Button
                      style={{paddingVertical: 10, paddingHorizontal: 10}}
                      title={t('screens.bookDetails.addLibrary')}
                      onPress={() => handleAddToLibrary(BookDetails?.book_id)}
                    />
                  ) : (
                    <Button
                      style={{paddingVertical: 10, paddingHorizontal: 10}}
                      title={t('screens.bookDetails.removeLibrary')}
                      onPress={() =>
                        handleRemoveFromLibrary(BookDetails?.book_id)
                      }
                    />
                  )}
                </View>
              </View>
            )}
            {!loggedIn && (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{width: '80%', paddingHorizontal: 5}}>
                  <Button
                    style={{paddingVertical: 10, paddingHorizontal: 10}}
                    title={t('screens.bookDetails.reading')}
                    onPress={() =>
                      isErotic
                        ? setIsVisible(prev => !prev)
                        : routeReadingScreen()
                    }
                  />
                </View>
                {/* <View style={{width: '100%', paddingHorizontal: 5}}>
                  {!isInLibrary ? (
                    <Button
                      style={{paddingVertical: 10, paddingHorizontal: 10}}
                      title={t('screens.bookDetails.addLibrary')}
                      onPress={() => handleAddToLibrary(BookDetails?.book_id)}
                    />
                  ) : (
                    <Button
                      style={{paddingVertical: 10, paddingHorizontal: 10}}
                      title={t('screens.bookDetails.removeLibrary')}
                      onPress={() =>
                        handleRemoveFromLibrary(BookDetails?.book_id)
                      }
                    />
                  )}
                </View> */}
              </View>
            )}
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
      <BottomDrawer
        visible={showModel}
        onClose={() => setShowModel(false)}
        title={t('screens.review.addBookReview')}>
        <View style={styles.footerContainer}>
          <View style={styles.reviewInputContainer}>
            <View style={styles.starView}>
              {/* <CustomText> Add your Star :</CustomText> */}
              <CustomStarRating
                size={30}
                onRatingChange={handleRatingChange}
                rate={ratingStar}
                isDisable={false}
              />
            </View>
            {/* <CustomText> Add your Star :</CustomText> */}
            <TextInput
              multiline
              style={styles.inputView}
              placeholder={t('screens.bookDetails.reviewPlaceholder')}
              onChangeText={handleChange}
              value={reviewText}
              placeholderTextColor={Colors.white}
            />
          </View>
          <Button
            title={t('screens.bookDetails.submit')}
            onPress={handleAddReview}
          />
        </View>
      </BottomDrawer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(prev => !prev)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                color: Colors.gradient,
                borderBottomWidth: 3,
                borderBottomColor: Colors.gradientReverse,
                fontSize: 32,
                marginBottom: moderateVerticalScale(10),
              }}>
              {t('screens.bookDetails.caution')}
            </Text>
            <Text
              style={{
                color: Colors.white,
                textAlign: 'justify',
              }}>
              {t('screens.bookDetails.warning1')}
              {'\n'}
              {t('screens.bookDetails.warning2')}
            </Text>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              <Checkbox
                checked={isCheck}
                onChange={() => {
                  setIsCheck(prev => !prev);
                  setErrorText('');
                }}
                label={t('screens.bookDetails.ageDec')}
                containerStyle={{
                  marginVertical: moderateVerticalScale(10),
                }}
              />
            </View>
            {errorText && (
              <Text
                style={{
                  color: Colors.danger,
                  textAlign: 'justify',
                }}>
                {' '}
                {errorText}
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
              }}>
              <Button
                title={t('screens.action.ok')}
                gradient={true}
                style={{paddingHorizontal: '20%'}}
                onPress={() => {
                  routeReadingScreen();
                }}
              />
              <Button
                title={t('screens.action.cancel')}
                gradient={true}
                style={{paddingHorizontal: '15%'}}
                onPress={() => setIsVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    minHeight: 250,
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
    // backgroundColor: Colors.gradient,
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    position: 'absolute',
    marginTop: 20,
    right: 10,
    backgroundColor: Colors.gradient,
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
  addButton: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 20,
  },
  reviewInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 15,
  },
  footerContainer: {
    paddingTop: 20,
    width: '100%',
  },
  starView: {
    gap: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  inputView: {
    color: Colors.white,
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: Colors.secondary,
    padding: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: Colors.tertiary,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default BookDetailsScreen;
