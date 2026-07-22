import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDuQUnQ3DH8jqwjqeIaKAR1vkPYSLiga8",
  authDomain: "kasi2campus-portal.firebaseapp.com",
  projectId: "kasi2campus-portal",
  storageBucket: "kasi2campus-portal.firebasestorage.app",
  messagingSenderId: "497895136276",
  appId: "1:497895136276:web:dfab59283a0d6f462f9b01",
  measurementId: "G-4QCH7SQ9G9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);