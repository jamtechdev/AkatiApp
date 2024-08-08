import React, {useEffect, useState} from 'react';
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
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useAppContext} from '../../_customContext/AppProvider';
import ChapterBottomDrawer from './_components/ChapterBottomDrawer';
import FilterBottomDrawer from './_components/FilterBottomDrawer';
import CommentsList from '../../components/comment/CommentsList';

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
  const [loadingComments, setLoadingComments] = useState(true);
  const {showToast, showLoader, hideLoader} = useAppContext();

  const [filterVisible, setFilterVisible] = useState(false); // State for filter modal
  const [textSettings, setTextSettings] = useState({
    textAlign: 'left',
    fontWeight: 'normal',
    fontFamily: 'default',
    color: '#fff',
    backgroundColor: Colors.primary,
  });
  const handleFilterApply = settings => {
    setTextSettings(settings);
    setFilterVisible(false);
  };

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
    // fetchComments();
  }, [currentChapter]);

  // const fetchComments = () => {
  //   const bookId = currentChapter?.book_id;
  //   const chapterId = currentChapter?.chapter_details?.chapter_id;
  //   commonServices
  //     .getComments(bookId, chapterId)
  //     .then(data => {
  //       setComments(data.data.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching comments:', error);
  //     })
  //     .finally(() => {
  //       setLoadingComments(false);
  //     });
  // };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    return;
  };
  return (
    <RowContainer>
      <View
        style={{
          flexDirection: 'row',
          gap: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <GradientView
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icons name={'long-arrow-left'} size={20} color={'white'} />
        </GradientView>
        <View style={{flexDirection: 'row', gap: 15}}>
          <TouchableText onPress={() => setShowComments(true)}>
            <Icons name={'comment'} size={20} color={'white'} />
          </TouchableText>
          <TouchableText onPress={() => setFilterVisible(true)}>
            <Icons name={'filter'} size={20} color={'white'} />
          </TouchableText>
          <TouchableText
            onPress={() => {
              setVisible(true);
              setModalData(chapters);
            }}>
            <Icons name={'list'} size={20} color={'white'} />
          </TouchableText>
        </View>
      </View>
      <View style={styles.chapterNum}>
        <TouchableText onPress={handlePrevChapter}>Prev</TouchableText>
        <CustomText>
          Chapter {currentChapterIndex + 1} of {chapters.length}
        </CustomText>
        <TouchableText onPress={handleNextChapter}>Next</TouchableText>
      </View>

      <ScrollView>
        <View>
          <HeadingText>{`Chapter ${currentChapterIndex + 1} - ${
            currentChapter?.chapter_details?.title
          }`}</HeadingText>

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
                {textSettings.fontColor}
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
              <CustomText style={{fontSize: 14, textAlign: 'center'}}>
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
        </View>
        <View>
          <HeadingText>{'Must Read'}</HeadingText>
          {!mustReadBooks && (
            <Skeleton isLoading={true} count={3} numColumns={3} />
          )}
          <HorizontalScrollView data={mustReadBooks} />
        </View>
      </ScrollView>

      <ChapterBottomDrawer
        visible={visible}
        data={modalData}
        onClose={() => setVisible(false)}
        currentChapter={currentChapterIndex}
        onPress={index => setCurrentChapterIndex(index)}
        title={BookDetails?.title}
      />
      <FilterBottomDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title={'Filter'}
        filterState={textSettings}
        setFilterState={setTextSettings}
      />
      <BottomDrawer
        visible={showComments}
        onClose={() => setShowComments(false)}
        title={'Comments'}>
        <CommentsList chapterDetails={currentChapter} />
      </BottomDrawer>
    </RowContainer>
  );
}

export default ReadingScreen;

const styles = StyleSheet.create({
  chapterNum: {
    flexDirection: 'row',
    gap: 75,
    backgroundColor: Colors.tertiary,
    paddingVertical: 10,
    paddingLeft: 5,
    marginVertical: 10,
    borderRadius: 10,
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    // position: 'absolute',
    width: 50,
    marginTop: 20,
  },
});
