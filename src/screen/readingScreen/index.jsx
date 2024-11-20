/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useEffect, useRef, useState} from 'react';
import {
  AlertModal,
  BottomDrawer,
  Button,
  CustomText,
  GradientView,
  HeadingText,
  HorizontalScrollView,
  HtmlContentRenderer,
  RowContainer,
  Skeleton,
  TouchableText,
} from '../../components';
import {booksService} from '../../_services/book.service';
import {useDispatch, useSelector} from 'react-redux';
import {getAuth} from '../../_store/_reducers/auth';
import {setLastReadingPosition, getBookProgress} from '../../_store/_reducers/books';
import {commonServices} from '../../_services/common.service';
import {
  LogBox,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppContext} from '../../_customContext/AppProvider';
import ChapterBottomDrawer from './_components/ChapterBottomDrawer';
import FilterBottomDrawer from './_components/FilterBottomDrawer';
import CommentsList from '../../components/comment/CommentsList';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import CommentsBottomDrawer from './_components/CommentBottomDrawer';
import FastImage from 'react-native-fast-image';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import coinImg from '../../images/coin-img.png';
import {publicService} from '../../_services/public.service';

function ReadingScreen({navigation, route}) {
  const {params} = route;
  const {bookId, BookDetails} = params;
  const {coins, loggedIn} = useSelector(getAuth);
  const bookProgress = useSelector(state => getBookProgress(state, bookId));
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState({});
  const [currentChapterIndex, setCurrentChapterIndex] = useState(bookProgress?.lastChapter || 0);
  const [showComments, setShowComments] = useState([]);
  const [autoUnlock, setAutoUnlock] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [mustReadBooks, setMustReadBooks] = useState();
  const [showOptions, setShowOptions] = useState(true);
  const [show, setShow] = useState(false);
  const {showToast, showLoader, hideLoader} = useAppContext();
  const scrollViewRef = useRef(null);
  const {width} = useWindowDimensions();
  const [filterVisible, setFilterVisible] = useState(false);
  const [textSettings, setTextSettings] = useState({
    textAlign: 'left',
    fontWeight: 'normal',
    fontFamily: 'baskerville',
    lineHeight: 40,
    fontSize: 17,
    color: '#fff',
    backgroundColorSecondary: Colors.tertiary,
    backgroundColor: Colors.primary,
  });

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      booksService
        .getMustReadBooks()
        .then(res => {
          setMustReadBooks(res.data.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [loggedIn]);
  useEffect(() => {
    if (bookId && BookDetails) {
      const bookData = {
        book_id: bookId,
        language: bookId.lng_id,
      };
      getChapterData(bookData);
    }
  }, [bookId, bookId]);
  useEffect(() => {
    if (chapters) {
      const current = chapters[currentChapterIndex];
      setCurrentChapter(current);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({y: 0, animated: true});
      }
    }
  }, [currentChapterIndex]);

  const getChapterData = bookData => {
    if (loggedIn) {
      booksService
        .getBookChapters(bookData)
        .then(response => {
          setChapters(response.data.chapters);
          const current = response.data.chapters[currentChapterIndex];
          setCurrentChapter(current);
          setTimeout(() => {
            if (scrollViewRef.current) {
              if (bookProgress?.lastScrollPosition && currentChapterIndex === bookProgress.lastChapter) {
                scrollViewRef.current.scrollTo({y: bookProgress.lastScrollPosition, animated: false});
              } else {
                scrollViewRef.current.scrollTo({y: 0, animated: true}); 
              }
            }
          }, 400);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      publicService
        .getPublicBookChapters(bookData.book_id, bookData.language)
        .then(response => {
          setChapters(response.data.chapters);
          const current = response.data.chapters[currentChapterIndex];
          setCurrentChapter(current);
        })
        .catch(error => {
          console.log(error, 'error ');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters?.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
    if (autoUnlock && currentChapter?.unlock !== 1) {
      handleUnlockChapter();
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };
  const handleSelectChapter = index => {
    if (currentChapterIndex !== index) {
      setCurrentChapterIndex(index);
    }
  };
  useEffect(() => {
    if (autoUnlock && currentChapter && currentChapter?.unlock !== 1) {
      handleUnlockChapter();
    }
  }, [autoUnlock, currentChapter, handleUnlockChapter]);

  const handleUnlockChapter = () => {
    if (!loggedIn) {
      setShow(true);
      // showToast('you need to login first for read this book', 'info');
      // navigation.navigate('signIn');
    }
    const formData = {
      book_id: currentChapter?.book_id,
      chapter_id: currentChapter?.id,
    };

    console.log(formData, 'formdata buy book');
    booksService
      .unlockChapter(formData)
      .then(res => {
        console.log(res.data);
        if (res.data.code == 201) {
          setVisible(false);
          showToast(res.data.message, 'error');
          return;
        }

        const bookData = {
          book_id: bookId,
          language: BookDetails.lng_id,
        };
        getChapterData(bookData);
        showToast(res.data.message);
        dispatch(updateCoins(coins - currentChapter?.chapter_reading_cost));
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const handleToggleOptions = () => setShowOptions(!showOptions);

  return (
    <RowContainer style={{backgroundColor: textSettings.backgroundColor}}>
      <View style={{position: 'absolute', top: 15, zIndex: 999}}>
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
      <View
        style={{
          flexDirection: 'row',
          gap: 50,
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingVertical: 10,
          height: 45,
        }}>
        {/* <GradientView
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icons name={'long-arrow-left'} size={20} color={Colors.white} />
          </GradientView> */}
        {showOptions && (
          <View style={{flexDirection: 'row', gap: 15}}>
            {loggedIn && (
              <TouchableText onPress={() => setShowComments(true)}>
                <MIcons name={'chat'} size={20} color={textSettings.color} />
              </TouchableText>
            )}
            <TouchableText onPress={() => setFilterVisible(true)}>
              <MCIcons
                name={'format-font'}
                size={20}
                color={textSettings.color}
              />
            </TouchableText>
            <TouchableText
              onPress={() => {
                setVisible(true);
                setModalData(chapters);
              }}>
              <MIcons
                name={'library-books'}
                size={20}
                color={textSettings.color}
              />
            </TouchableText>
          </View>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={e => {
          const scrollPosition = e.nativeEvent.contentOffset.y;
          dispatch(
            setLastReadingPosition({
              bookId,
              chapter: currentChapterIndex,
              scrollPosition: scrollPosition,
            }),
          );
        }}
        scrollEventThrottle={1000}>
        <Pressable onPress={handleToggleOptions} style={{flex: 1}}>
          <>
            <HeadingText style={{color: textSettings.color}}>
              {currentChapter?.chapter_details?.title}
            </HeadingText>
            {loading ? (
              <View style={{marginVertical: 20}}>
                <Skeleton isLoading={true} count={25} isLine={true} />
              </View>
            ) : (
              <View>
                {currentChapter && currentChapter?.unlock === 1 ? (
                  <View style={{marginVertical: 10}}>
                    <HtmlContentRenderer
                      htmlContent={currentChapter?.chapter_details?.content}
                      textSettings={textSettings}
                    />
                    <View
                      style={{
                        paddingTop: 60,
                        paddingVertical: 20,
                      }}>
                      <Icons
                        name={'heart'}
                        size={100}
                        color={Colors.secondary}
                        style={{textAlign: 'center'}}
                      />
                      <CustomText
                        style={{
                          paddingVertical: 30,
                          fontWeight: 'bold',
                          fontSize: 14,
                          textAlign: 'center',
                          color: textSettings.color,
                        }}>
                        {t('screens.reading.thanksForReading')}
                      </CustomText>
                    </View>
                    <View style={{paddingVertical: 10, paddingBottom: 50}}>
                      {currentChapterIndex === chapters?.length - 1 ? (
                        BookDetails.is_complete == 0 && (
                          <CustomText
                            style={{
                              color: Colors.secondary,
                              fontSize: 14,
                              fontWeight: 'bold',
                              textAlign: 'center',
                            }}>
                            {t('screens.reading.stayTuned')}
                          </CustomText>
                        )
                      ) : (
                        <Button
                          title={t('screens.reading.nextChapter')}
                          onPress={handleNextChapter}
                        />
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={{paddingVertical: 50, paddingHorizontal: 20}}>
                    <CustomText
                      style={{
                        fontSize: 14,
                        textAlign: 'center',
                        color: textSettings.color,
                      }}>
                      {t('screens.reading.story')}
                    </CustomText>
                    <Button
                      title={t('screens.reading.unlockThisChapter')}
                      onPress={handleUnlockChapter}
                      style={{marginTop: 50}}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 5,
                        marginTop: moderateVerticalScale(30),
                      }}>
                      <CustomText
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          // marginVertical: 30,
                          color: textSettings.color,
                        }}>
                        {t('screens.reading.price')}
                      </CustomText>
                      <FastImage
                        source={coinImg}
                        style={{
                          width: moderateScale(20),
                          height: moderateVerticalScale(20),
                        }}
                      />
                      <CustomText
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          // marginVertical: 30,
                          color: textSettings.color,
                        }}>
                        {currentChapter?.coin}
                      </CustomText>
                    </View>
                  </View>
                )}
              </View>
            )}
            {loggedIn && (
              <View>
                <HeadingText style={{color: textSettings.color}}>
                  {t('screens.reading.mustRead')}
                </HeadingText>
                {!mustReadBooks && (
                  <Skeleton isLoading={true} count={3} numColumns={3} />
                )}
                <HorizontalScrollView data={mustReadBooks} />
              </View>
            )}
          </>
        </Pressable>
      </ScrollView>
      {showOptions && (
        <View
          style={[
            styles.chapterNum,
            {backgroundColor: textSettings.backgroundColorSecondary},
          ]}>
          <TouchableText
            style={{color: textSettings.color}}
            onPress={handlePrevChapter}>
            {t('screens.reading.previous')}
          </TouchableText>
          <CustomText style={{color: textSettings.color}}>
            {t('screens.reading.chapter')} {currentChapterIndex + 1} of{' '}
            {chapters?.length}
          </CustomText>
          {currentChapterIndex + 1 !== chapters?.length ? (
            <TouchableText
              style={{color: textSettings.color}}
              onPress={handleNextChapter}>
              {t('screens.reading.next')}
            </TouchableText>
          ) : (
            <TouchableText style={{color: textSettings.color}}> </TouchableText>
          )}
        </View>
      )}
      <ChapterBottomDrawer
        visible={visible}
        data={modalData}
        onClose={() => setVisible(false)}
        currentChapter={currentChapterIndex}
        onPress={index => setCurrentChapterIndex(index)}
        title={BookDetails?.title}
        textSettings={textSettings}
        autoUnlock={autoUnlock}
        setAutoUnlock={setAutoUnlock}
      />
      <FilterBottomDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title={t('screens.reading.filter')}
        filterState={textSettings}
        setFilterState={setTextSettings}
      />
      <CommentsBottomDrawer
        visible={showComments}
        onClose={() => setShowComments(false)}
        title={t('screens.reading.comment')}
        textSettings={textSettings}
        style={{height: '85%'}}>
        <View style={{height: '100%'}}>
          <CommentsList
            chapterDetails={currentChapter}
            textSettings={textSettings}
          />
        </View>
      </CommentsBottomDrawer>
      <AlertModal
        visible={show}
        description={'You need to login first for read this book'}
        onOkay={() => navigation.navigate('signIn')}
        onCancel={() => setShow(false)}
      />
    </RowContainer>
  );
}

export default ReadingScreen;

const styles = StyleSheet.create({
  chapterNum: {
    flexDirection: 'row',
    gap: 75,
    backgroundColor: Colors.tertiary,
    padding: 15,
    justifyContent: 'space-evenly',
    borderRadius: 10,
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 50,
  },
});
