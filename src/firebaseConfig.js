import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBh_hUX8EBd2bEljXchyEnIb7pt0GNJW18",
  authDomain: "vue-3-course-d4d8a.firebaseapp.com",
  projectId: "vue-3-course-d4d8a",
  storageBucket: "vue-3-course-d4d8a.appspot.com",
  messagingSenderId: "765773202828",
  appId: "1:765773202828:web:7c47b044099cbd0d9782a9"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(firebaseApp);

export { auth, db, storage }; 