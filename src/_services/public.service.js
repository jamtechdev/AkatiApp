import axios from "axios";
import { API_URL } from "../_constant";
export const publicService = {
    getPublicBooks,
    getPublicBookById,
    getPublicBookChapters
};

async function getPublicBooks(lang) {
    return await axios.get(`${API_URL}/get-Book-Details-By-Category`, {
        headers: {
            language: lang,
        },
    });
}

async function getPublicBookById(id, lang) {
    return await axios.get(`${API_URL}/books/book-details?book_id=${id}`, {
        headers: {
            language: lang,
        },
    });
}

async function getPublicBookChapters(id, lang) {
    return await axios.get(`${API_URL}/books/all-chapters?book_id=${id}`, {
        headers: {
            language: lang,
        },
    });
}