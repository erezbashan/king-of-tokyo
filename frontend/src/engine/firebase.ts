import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "MOCK_API_KEY",
  authDomain: "mock.firebaseapp.com",
  projectId: "mock",
  storageBucket: "mock.appspot.com",
  messagingSenderId: "123",
  appId: "123"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
