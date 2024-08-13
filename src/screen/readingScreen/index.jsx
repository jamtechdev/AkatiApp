import React, {useEffect, useRef, useState} from 'react';
import {
  BottomDrawer,
  Button,
  CustomText,
  GradientView,
  HeadingText,
  HorizontalScrollView,
  RowContainer,
  Skeleton,
  TouchableText,
} from '../../components';
import {booksService} from '../../_services/book.service';
import {useSelector} from 'react-redux';
import {getAuth} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {
  LogBox,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
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
import CommentsBottomDrawer from './_components/CommentBottomDrawer';

function ReadingScreen({navigation, route}) {
  const {params} = route;
  const {bookId, chapters, BookDetails, categories} = params;
  const {coins} = useSelector(getAuth);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showComments, setShowComments] = useState([]);
  const [autoUnlock, setAutoUnlock] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [mustReadBooks, setMustReadBooks] = useState();
  const [showOptions, setShowOptions] = useState(true);
  const {showToast, showLoader, hideLoader} = useAppContext();
  const scrollViewRef = useRef(null); // Reference for ScrollView

  const [filterVisible, setFilterVisible] = useState(false); // State for filter modal
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
    booksService
      .getMustReadBooks()
      .then(res => {
        setMustReadBooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [params]);

  const getChapterData = bookData => {
    booksService
      .getBookChapters(bookData)
      .then(response => {
        setChapters(response.data.chapters);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: true}); // Auto scroll to top
    }
  }, [currentChapterIndex]);

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
    if (autoUnlock && currentChapter.unlock !== 1) {
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
  }, [currentChapter]);

  const handleUnlockChapter = () => {
    const formData = {
      book_id: currentChapter.book_id,
      chapter_id: currentChapter.id,
    };

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
        dispatch(updateCoins(coins - currentChapter.chapter_reading_cost));
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
            <TouchableText onPress={() => setShowComments(true)}>
              <MIcons name={'chat'} size={20} color={textSettings.color} />
            </TouchableText>
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

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleToggleOptions} style={{flex: 1}}>
          <>
            <HeadingText style={{color: textSettings.color}}>{`Chapter ${
              currentChapterIndex + 1
            } - ${currentChapter?.chapter_details?.title}`}</HeadingText>
            {currentChapter && currentChapter.unlock === 1 ? (
              <View style={{marginVertical: 10}}>
                <Text
                  style={[
                    styles.chapterContent,
                    {
                      textAlign: textSettings.textAlign,
                      fontWeight: textSettings.fontWeight,
                      lineHeight: textSettings.lineHeight,
                      fontFamily: textSettings.fontFamily,
                      color: textSettings.color,
                      fontSize: textSettings.fontSize,
                      backgroundColor: textSettings.backgroundColor,
                    },
                  ]}>
                  {currentChapter?.chapter_details?.content}
                </Text>
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
                    Thanks for reading!{' '}
                  </CustomText>
                </View>
                <View style={{paddingVertical: 10, paddingBottom: 50}}>
                  {currentChapterIndex === chapters.length - 1 ? (
                    BookDetails.is_complete == 0 && (
                      <CustomText
                        style={{
                          color: Colors.secondary,
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {' '}
                        Stay Tuned, more chapters are coming soon...
                      </CustomText>
                    )
                  ) : (
                    <Button title="Next Chapter" onPress={handleNextChapter} />
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
                  The story of this chapter is full of surprises. May you enjoy
                  your time when reading it.
                </CustomText>
                <Button
                  title="Unlock This Chapter"
                  onPress={handleUnlockChapter}
                  style={{marginTop: 50}}
                />

                <CustomText
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginVertical: 30,
                    color: textSettings.color,
                  }}>
                  Price :{' '}
                  <Icons
                    name={'dollar'}
                    size={15}
                    color={Colors.secondary}
                    style={{textAlign: 'center'}}
                  />{' '}
                  {currentChapter?.chapter_reading_cost}
                </CustomText>
              </View>
            )}
            <View>
              <HeadingText style={{color: textSettings.color}}>
                {'Must Read'}
              </HeadingText>
              {!mustReadBooks && (
                <Skeleton isLoading={true} count={3} numColumns={3} />
              )}
              <HorizontalScrollView data={mustReadBooks} />
            </View>
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
            Prev
          </TouchableText>
          <CustomText style={{color: textSettings.color}}>
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </CustomText>
          {currentChapterIndex + 1 !== chapters.length ? (
            <TouchableText
              style={{color: textSettings.color}}
              onPress={handleNextChapter}>
              Next
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
      />
      <FilterBottomDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title={'Filter'}
        filterState={textSettings}
        setFilterState={setTextSettings}
      />
      <CommentsBottomDrawer
        visible={showComments}
        onClose={() => setShowComments(false)}
        title={'Comments'}
        textSettings={textSettings}
        style={{height: '85%'}}>
        <View style={{height: '100%'}}>
          <CommentsList
            chapterDetails={currentChapter}
            textSettings={textSettings}
          />
        </View>
      </CommentsBottomDrawer>
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
