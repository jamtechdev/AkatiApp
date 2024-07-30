import axios from "axios";
import axiosInstance from "./axiosInstance";
import Config from "../_constant/Config";
export const authService = {
  signIn,
  signUp,
  sendVerificationEmail,
  sendOtp,
  verifyOtp,
  resetPassword,
  socialAuth,
  profileDetails,
  getPublicBooks
};
const {API_URL} = Config

async function signIn(data) {
  return await axios.post(`${API_URL}/sign-in`, data);
}
async function signUp(data) {
  return await axios.post(`${API_URL}/sign-up`, data);
}

async function sendVerificationEmail(data) {
  return axios.post(`${API_URL}/sendVerificationEmail`, data);
}

async function sendOtp(data) {
  return axios.post(`${API_URL}/forgotPassword`, data);
}

async function verifyOtp(data) {
  return axios.post(`${API_URL}/verifyOtp`, data);
}
async function resetPassword(data) {
  return axios.post(`${API_URL}/resetPassword`, data);
}
async function socialAuth(data) {
  return axios.post(`${API_URL}/social-auth`, data);
}
async function profileDetails() {
  return await axiosInstance.get("/details");
}

async function getPublicBooks(lang) {
  return await axios.get(`${API_URL}/get-Book-Details-By-Category`, {
    headers: {
      language: lang,
    },
  });
}