import React, {useEffect, useState} from 'react';
import {
  BottomDrawer,
  Button,
  CustomText,
  GradientView,
  HeadingText,
  RowContainer,
  TouchableText,
} from '../../components';
import {booksService} from '../../_services/book.service';
import {useSelector} from 'react-redux';
import {getAuth} from '../../_store/_reducers/auth';
import {commonServices} from '../../_services/common.service';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import Icons from 'react-native-vector-icons/FontAwesome';

function ReadingScreen({navigation, route}) {
  const {params} = route;
  const {coins} = useSelector(getAuth);
  const [bookDetails, setBookDetails] = useState();
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [autoUnlock, setAutoUnlock] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [mustReadBooks, setMustReadBooks] = useState();
  const [loadingComments, setLoadingComments] = useState(true);
  useEffect(() => {
    booksService
      .getBookById(params.bookId)
      .then(res => {
        setBookDetails(res.data.data);
        if (res.data) {
          const bookData = {
            book_id: res.data.data.id,
            language: res.data.data.BookDetails.lng_id,
          };

          getChapterData(bookData);
        }
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
  }, [params.bookId]);

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
    // window.scrollTo(0, 0);
    fetchComments();
  }, [currentChapter]);

  const fetchComments = () => {
    const bookId = currentChapter?.book_id;
    const chapterId = currentChapter?.chapter_details?.chapter_id;
    commonServices
      .getComments(bookId, chapterId)
      .then(data => {
        setComments(data.data.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      })
      .finally(() => {
        setLoadingComments(false);
      });
  };

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
        if (res.data.code == 201) {
          toggleModel();
          return;
        }

        const bookData = {
          book_id: bookDetails.id,
          language: bookDetails.BookDetails.lng_id,
        };
        getChapterData(bookData);
        toast.success(res.data.message);
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
          <TouchableText>
            <Icons name={'comment'} size={20} color={'white'} />
          </TouchableText>
          <TouchableText>
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
          <CustomText style={{marginVertical: 10}}>
            {currentChapter?.chapter_details?.content}
          </CustomText>
        </View>
      </ScrollView>
      <BottomDrawer
        visible={visible}
        data={modalData}
        onClose={() => setVisible(false)}
        currentChapter={currentChapterIndex}
        onPress={index => setCurrentChapterIndex(index)}
        title={bookDetails?.BookDetails?.title}
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
