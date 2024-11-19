import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './auth';
import booksSlice from './books';

const rootReducer = combineReducers({
  auth: authSlice,
  books: booksSlice
});

export default rootReducer;
