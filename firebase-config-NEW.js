// Firebase configuratie - vervang met je eigen config
const firebaseConfig = {
    apiKey: "JOUW_API_KEY",
    authDomain: "epstein-united.firebaseapp.com",
    projectId: "epstein-united",
    storageBucket: "epstein-united.appspot.com",
    messagingSenderId: "JOUW_SENDER_ID",
    appId: "JOUW_APP_ID"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Export voor gebruik in andere files
window.firebaseDB = db;
window.firebaseAuth = auth;
