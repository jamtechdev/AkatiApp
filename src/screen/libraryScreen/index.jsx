import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  SkeletonLoader,
  Checkbox,
  Button,
  Card,
  Skeleton,
  GradientView,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {booksService} from '../../_services/book.service';
import {getLanguage} from '../../_store/_reducers/auth';
import {useSelector} from 'react-redux';
import {useAppContext} from '../../_customContext/AppProvider';
import {useFocusEffect} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function LibraryScreen({navigation}) {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const language = useSelector(getLanguage);
  const [libraryBooks, setLibraryBooks] = useState();
  const [editMode, setEditMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState({});
  const [allSelected, setAllSelected] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchLibraryBook();
    }, [language]),
  );

  const fetchLibraryBook = () => {
    booksService
      .getLibraryBooks()
      .then(res => {
        setLibraryBooks(res.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEdit = () => {
    setEditMode(!editMode);
    setSelectedBooks({});
    setAllSelected(false);
  };

  const handleSelectAll = () => {
    const newSelectedBooks = {};
    if (!allSelected) {
      libraryBooks.forEach(book => {
        newSelectedBooks[book.id] = true;
      });
    }
    setSelectedBooks(newSelectedBooks);
    setAllSelected(!allSelected);
  };

  const handleSelectBook = bookId => {
    const newSelectedBooks = {
      ...selectedBooks,
      [bookId]: !selectedBooks[bookId],
    };
    setSelectedBooks(newSelectedBooks);
    setAllSelected(
      Object.keys(newSelectedBooks).length === libraryBooks.length &&
        Object.values(newSelectedBooks).every(val => val),
    );
  };

  const handleDelete = () => {
    const booksToDelete = Object.keys(selectedBooks).filter(
      bookId => selectedBooks[bookId],
    );
    if (booksToDelete.length === 0) {
      showToast('Please select at least one book to delete.', 'error');
      return;
    }
    const selectAll = allSelected ? 1 : 0;
    console.log(booksToDelete);
    // return
    booksService
      .removeFromLibrary({book_id: booksToDelete, select_all: selectAll})
      .then(() => {
        setLibraryBooks(libraryBooks.filter(book => !selectedBooks[book.id]));
        setSelectedBooks({});
        setAllSelected(false);
        setEditMode(false);
        showToast('Selected books have been deleted successfully.');
      })
      .catch(error => {
        console.log(error);
        showToast('An error occurred while deleting the books.', 'error');
      });
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.cardContainer}>
        {editMode && (
          <View style={styles.overlay}>
            <Checkbox
              label=""
              checked={!!selectedBooks[item.id]}
              onChange={() => handleSelectBook(item.id)}
            />
          </View>
        )}
        <View style={editMode ? styles.cardWithOverlay : styles.card}>
          <Card item={item} />
        </View>
      </View>
    );
  };

  return (
    <RowContainer>
      <View style={styles.headerRow}>
        <HeadingText>Library Books</HeadingText>
        <View style={{ justifyContent:'center', flexDirection: 'row', gap: 10}}>
        {editMode && (
          <>
            <GradientView
              style={styles.editModeButton}
              onPress={handleSelectAll}>
              <Icons name={'check-all'} size={20} color={'white'} />
            </GradientView>
            <GradientView style={styles.editModeButton} onPress={handleDelete}>
              <Icons name={'book-remove-multiple'} size={20} color={'white'} />
            </GradientView>
          </>
        )}
        {libraryBooks && libraryBooks?.length !== 0 && (
          <GradientView style={styles.editModeButton} onPress={handleEdit}>
            <Icons
              name={!editMode ? 'book-edit' : 'close'}
              size={20}
              color={'white'}
            />
          </GradientView>
        )}
        </View>
      </View>

      {!libraryBooks ? (
        <Skeleton isLoading={true} numColumns={2} />
      ) : libraryBooks.length == 0 ? (
        <View style={styles.noData}>
          <Image
            source={require('../../images/no-book.png')}
            style={styles.imgData}
          />
          <CustomText>
            You have no books in your library yet. Let's embark together on the
            journey...
          </CustomText>
          <Button
            title={'Discover'}
            onPress={() => navigation.navigate('Home')}
            style={{width: '100%', paddingHorizontal: 50, marginTop: 20}}
          />
        </View>
      ) : (
        <FlatList
          data={libraryBooks}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </RowContainer>
  );
}
const styles = StyleSheet.create({
  noData: {
    marginHorizontal: 'auto',
    width: '80%',
    height: '70%',
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  imgData: {
    height: '60%',
    width: '90%',
    // marginHorizontal: 5,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: Colors.white,
    fontSize: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 5,
    borderRadius: 10,
    zIndex: 1000,
  },
  card: {
    overflow: 'hidden',
  },
  cardWithOverlay: {
    overflow: 'hidden',
    opacity: 0.6,
  },
  editModeButton: {
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
  },
});
