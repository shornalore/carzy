import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "carzy-7b6e3.firebaseapp.com",
    projectId: "carzy-7b6e3",
    storageBucket: "carzy-7b6e3.appspot.com",
    messagingSenderId: "765217283133",
    appId: "1:765217283133:web:7b6b1dbf1276c5d8191e54",
    measurementId: "G-XS3EYFWM36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
