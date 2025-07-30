// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'hobo-livings',
  appId: '1:427798360692:web:b50b889282c1b4bec29721',
  storageBucket: 'hobo-livings.firebasestorage.app',
  apiKey: 'AIzaSyDHKOdFuk4Ak4DqkwnXtB_dnlA_ZlwTWno',
  authDomain: 'hobo-livings.firebaseapp.com',
  messagingSenderId: '427798360692',
  measurementId: '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);


// This is an async call, but we don't need to wait for it to complete.
// Firestore will start queuing up operations and will sync once persistence is enabled.
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.error("Firestore persistence failed: failed-precondition. Multiple tabs open?");
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.error("Firestore persistence failed: unimplemented. Browser not supported?");
    }
  });


export { db };
