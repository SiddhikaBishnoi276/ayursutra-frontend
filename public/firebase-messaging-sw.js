importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCn0k6oNgz_QGBP7VwFHb2NwWc-XOmlHa0",
    authDomain: "ayursutra-7c88f.firebaseapp.com",
    projectId: "ayursutra-7c88f",
    storageBucket: "ayursutra-7c88f.firebasestorage.app",
    messagingSenderId: "588992952751",
    appId: "1:588992952751:web:66707947c3207771fb975a",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log("Background message:", payload);
});