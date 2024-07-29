import axiosInstance from "./axiosInstance"; // Adjust the path as needed

export const booksService = {
  getMustReadBooks,
  getNewBooksList,
  getLibraryBooks,
  getAlsoLikeBooks,
  getPopularBooks,
  getBookById,
  getBookChapters,
  addReview,
  addToLibrary,
  removeFromLibrary,
  searchBooks,
  unlockChapter,
  getBookCategory,
};

async function getMustReadBooks() {
  return await axiosInstance.get("/discover/MustreadBooks");
}

async function searchBooks(terms, category) {
  return await axiosInstance.get(
    `/discover/books?search_term=${terms == null ? "" : terms}&category=${
      category == null ? "" : category
    }`
  );
}

async function getNewBooksList() {
  return await axiosInstance.get("/new-books-list");
}

async function getLibraryBooks() {
  return await axiosInstance.get("/library/books");
}

async function getAlsoLikeBooks(terms) {
  return await axiosInstance.get(`/discover/books`);
}

async function getPopularBooks() {
  return await axiosInstance.get("/discover/PopularBooks");
}

async function getBookById(id) {
  return await axiosInstance.get(`/books/book-details?book_id=${id}`);
}

async function getBookChapters(data) {
  return await axiosInstance.post("/books/chapters", data);
}

async function addReview(data) {
  return await axiosInstance.post("/books/review-rating-add", data);
}

async function addToLibrary(data) {
  return await axiosInstance.post("/library/books/add-new", data);
}

async function removeFromLibrary(data) {
  return await axiosInstance.post("/library/books/remove", data);
}

async function unlockChapter(data) {
  return await axiosInstance.post("/chapterUnlockCoins", data);
}


async function getBookCategory() {
  return await axiosInstance.get("/getBookByCategory");
}
