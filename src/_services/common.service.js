import axios from 'axios';
import axiosInstance from './axiosInstance';

export const commonServices = {
  getLanguage,
  getRechargePlans,
  setLanguage,
  getPrivacyPolicy,
  getTermsConditions,
  getNotifications,
  getHistory,
  removeHistory,
  getBookCategories,
  getTransactionHistory,
  makePayment,
  getAppReview,
  postAppReview,
  deleteAccount,
  getComments,
  addComments,
  replayComments,
  favoriteComments,
  publishBook,
  getBookSuggestions,
};

async function getLanguage() {
  return await axiosInstance.get(`/languageList`);
}

async function setLanguage(data) {
  return await axiosInstance.post(`/languageUpdate`, data);
}

async function getPrivacyPolicy() {
  return await axiosInstance.get(`/getPolicyPrivacy`);
}
async function getTermsConditions() {
  return await axiosInstance.get(`/getTermsAndConditions`);
}

async function getRechargePlans() {
  return await axiosInstance.get(`/rechargePlans`);
}
async function getTransactionHistory() {
  return await axiosInstance.get(`/getTransactionHistory`);
}

async function getNotifications() {
  return await axiosInstance.get(`/getNotificationList`);
}

async function getHistory() {
  return await axiosInstance.get(`/books/search-history`);
}

async function removeHistory(data) {
  return await axiosInstance.post(
    `/books/search-history/remove`,
    data
  );
}

async function getBookCategories() {
  return await axiosInstance.get('/getBookCategories');
}

async function makePayment(data) {
  return await axiosInstance.post(`/PaypalTransactionHistory`, data);
}

async function postAppReview(data) {
  return await axiosInstance.post(
    `/app-reviews?star=${data.star}&description=${data.description}`,
  );
}

async function getAppReview() {
  return await axiosInstance.get(`/get-all-reviews`);
}

async function deleteAccount(mail) {
  return await axiosInstance.post('/deleteAccount', {email: mail});
}

async function getComments(book_id, chapter_id) {
  return await axiosInstance.get(
    `/comments?book_id=${book_id}&chapter_id=${chapter_id}`,
  );
}

async function addComments(data) {
  return await axiosInstance.post('/comments/store', data);
}

async function replayComments(data) {
  return await axiosInstance.post('/comments/reply', data);
}

async function favoriteComments(commentId) {
  return await axiosInstance.post('/comments/favorite', {
    comment_id: commentId,
  });
}
async function publishBook(data) {
  return await axiosInstance.post('/publish-book', data);
}

async function getBookSuggestions() {
  return await axiosInstance.post("/book-suggestions");
}