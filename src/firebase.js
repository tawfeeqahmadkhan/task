import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
 export const firebaseConfig = {
    apiKey: "AIzaSyBhbTdUkvogOA6yY2qkv7pOjFfPYkDn5dI",
    authDomain: "tawfeeq-42f99.firebaseapp.com",
    projectId: "tawfeeq-42f99",
    storageBucket: "tawfeeq-42f99.appspot.com",
    messagingSenderId: "1043320380597",
    measurementId: "G-JZBWVBPJBX",
    appId: "1:1043320380597:web:dfc24d59c6dee00968f2fc",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);
