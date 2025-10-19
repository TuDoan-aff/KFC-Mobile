// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAciqytU24ogdYeRIWbztHl9Gpt_A6hPag",
  authDomain: "kfc-da.firebaseapp.com",
  databaseURL: "https://kfc-da-default-rtdb.firebaseio.com/",
  projectId: "kfc-da",
  storageBucket: "kfc-da.appspot.com", // ✅ sửa lại chỗ này
  messagingSenderId: "245626329824",
  appId: "1:245626329824:web:17d8e9295f2069101d0e85",
  measurementId: "G-5ZLKMPY20Z"
};

// ✅ Initialize App ĐÚNG VỊ TRÍ
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
