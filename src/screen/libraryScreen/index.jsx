import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CustomText,
  HeadingText,
  RowContainer,
  SkeletonLoader,
  Checkbox,
  Button,
  Card,
} from '../../components';
import {Colors} from '../../_utils/GlobalStyle';
import {booksService} from '../../_services/book.service';
import {getLanguage} from '../../_store/_reducers/auth';
import {useSelector} from 'react-redux';
import {useAppContext} from '../../_customContext/AppProvider';

export default function LibraryScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const language = useSelector(getLanguage);
  const [libraryBooks, setLibraryBooks] = useState();
  const [editMode, setEditMode] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState({});
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    fetchLibraryBook();
  }, [language]);
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
          <Checkbox
            label=""
            checked={!!selectedBooks[item.id]}
            onChange={() => handleSelectBook(item.id)}
          />
        )}
        <Card item={item} />
      </View>
    );
  };

  return (
    <RowContainer>
      <View style={styles.headerRow}>
        <HeadingText>Library</HeadingText>
        {libraryBooks?.length !== 0 && (
          <Button title={editMode ? 'Cancel' : 'Edit'} onPress={handleEdit} />
        )}
      </View>
      <View style={styles.headerRow}>
        {editMode && (
          <>
            <Button
              title={allSelected ? 'Deselect All' : 'Select All'}
              onPress={handleSelectAll}
            />
            <Button title={'Remove Books'} onPress={handleDelete} />
          </>
        )}
      </View>
      {libraryBooks?.length == 0 && (
        <View style={styles.noData}>
          <Image
            source={require('../../images/no-book.png')}
            style={styles.imgData}
          />
          <CustomText>No Data Found...</CustomText>
        </View>
      )}
      <FlatList
        data={libraryBooks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  noData: {
    textAlign: 'center',
    width: '100%',
    height: '80%',
    backgroundColor: Colors.tertiary,
  },
  imgData: {
    height: '50%',
    width: '100%',
    marginHorizontal: 5,
  },
  container: {
    flex: 1,
    padding: 16,
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
  },
});
