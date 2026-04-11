// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics,isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ9W7fnkPcrrbZmV5qLz1YUJbBJvH08-k",
  authDomain: "streamlineplatform.firebaseapp.com",
  projectId: "streamlineplatform",
  storageBucket: "streamlineplatform.firebasestorage.app",
  messagingSenderId: "183266233246", 
  appId: "1:183266233246:web:685c959ab305688ec0e48f",
  measurementId: "G-WE3ZN61CGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Conditionally initialize Analytics
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const auth = getAuth(app);
// console.log("auth", auth)
// export {app};
export {app, analytics, auth, db};