// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA87YXLGNZmmfiKsTi5bDHWU7p8YEVxB6E",
  authDomain: "akati-80d24.firebaseapp.com",
  databaseURL: "https://akati-80d24-default-rtdb.firebaseio.com",
  projectId: "akati-80d24",
  storageBucket: "akati-80d24.appspot.com",
  messagingSenderId: "591314454636",
  appId: "1:591314454636:web:d642229cb9054094d23049",
  measurementId: "G-BNEDC1D5JJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const GoogleAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const messanging = getMessaging(app);
