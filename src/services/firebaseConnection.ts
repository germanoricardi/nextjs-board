import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

let firebaseConfig = {
  apiKey: "AIzaSyDux9xLAR5l4xIp1SmoabPQkPzWhfFugtQ",
  authDomain: "nextjs-boardapp.firebaseapp.com",
  projectId: "nextjs-boardapp",
  storageBucket: "nextjs-boardapp.appspot.com",
  messagingSenderId: "752765856222",
  appId: "1:752765856222:web:fc98dfc3b2442e23b3554f",
  measurementId: "G-C9S2CB7M7M"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
