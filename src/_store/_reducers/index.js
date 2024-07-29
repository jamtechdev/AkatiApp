import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./auth";
const rootReducer = combineReducers({
  auth: authSlice,
});
export default rootReducer;
