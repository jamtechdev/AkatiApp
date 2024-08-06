import React, {useEffect, useState} from 'react';
import {
  Button,
  CustomText,
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

function ReadingScreen({route}) {
  const {params} = route;
  const {coins} = useSelector(getAuth);
  const [bookDetails, setBookDetails] = useState();
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [autoUnlock, setAutoUnlock] = useState(false);

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
    console.log('nexttttttttttt');
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
    console.log(currentChapter);

    booksService
      .unlockChapter(formData)
      .then(res => {
        if (res.data.code == 201) {
          toggleModel();
          return;
        }
        console.log(res);
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
        toast.error('something went wrong');
      });
    return;
  };
  return (
    <RowContainer>
      <HeadingText>Reading</HeadingText>
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
});
