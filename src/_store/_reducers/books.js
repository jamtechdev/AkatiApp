import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: {} // Will store book details indexed by bookId
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setLastReadingPosition: (state, action) => {
      const { bookId, chapter, scrollPosition } = action.payload;
      
      // Create or update book entry
      state.books[bookId] = {
        ...state.books[bookId],
        lastChapter: chapter,
        lastScrollPosition: scrollPosition || 0,
        lastReadAt: new Date().toISOString()
      };
    },
    clearBookProgress: (state, action) => {
      const { bookId } = action.payload;
      delete state.books[bookId];
    },
    clearAllBooks: (state) => {
      state.books = {};
    }
  }
});

export const { setLastReadingPosition, clearBookProgress, clearAllBooks } = booksSlice.actions;

export const getBookProgress = (state, bookId) => state?.books?.books[bookId];
export const getAllBooks = (state) => state?.books?.books;

export default booksSlice.reducer;
