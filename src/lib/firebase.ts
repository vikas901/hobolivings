// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'hobo-livings',
  appId: '1:427798360692:web:b50b889282c1b4bec29721',
  storageBucket: 'hobo-livings.appspot.com',
  apiKey: 'AIzaSyDHKOdFuk4Ak4DqkwnXtB_dnlA_ZlwTWno',
  authDomain: 'hobo-livings.firebaseapp.com',
  messagingSenderId: '427798360692',
  measurementId: '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with persistent caching
const db = initializeFirestore(app, {
  cache: persistentLocalCache({}),
});


export { db };
