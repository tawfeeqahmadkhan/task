importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    console.log('Service Worker registration successful with scope: ', registration.scope);
  })
  .catch((error) => {
    console.log('Service Worker registration failed:', error);
  });
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBhbTdUkvogOA6yY2qkv7pOjFfPYkDn5dI",
  authDomain: "tawfeeq-42f99.firebaseapp.com",
  projectId: "tawfeeq-42f99",
  storageBucket: "tawfeeq-42f99.appspot.com",
  messagingSenderId: "1043320380597",
  appId: "1:1043320380597:web:dfc24d59c6dee00968f2fc",
  measurementId: "G-JZBWVBPJBX"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload.
  data.message);
  const notificationTitle = payload.data.message;
  const notificationOptions = {
    body: payload.data.message,
    icon: 'https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_28dp.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
