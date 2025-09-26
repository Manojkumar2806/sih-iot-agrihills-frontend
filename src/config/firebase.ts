import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAzfw3KD1M7GlUQ3AVMsI4G3Go0KEAjcrg",
  authDomain: "smart-irrigation-system-be7cc.firebaseapp.com",
  databaseURL: "https://smart-irrigation-system-be7cc-default-rtdb.firebaseio.com",
  projectId: "smart-irrigation-system-be7cc",
  storageBucket: "smart-irrigation-system-be7cc.firebasestorage.app",
  messagingSenderId: "912567836605",
  appId: "1:912567836605:web:2c866242e743f81edefcd4"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;