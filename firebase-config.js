// Firebase configuratie - vervang met je eigen config
const firebaseConfig = {
  apiKey: "AIzaSyAt-n2A_3FH9rY-XtsdfuHTgjtJQHIxqAY",
  authDomain: "epsteinunited.firebaseapp.com",
  projectId: "epstein-united", // <-- STREEPJE TERUGGEPLAATST!
  storageBucket: "epsteinunited.appspot.com",
  messagingSenderId: "603988196357",
  appId: "1:603988196357:web:203e9451d880aafe63b06c",
  measurementId: "G-BBSLNQFGH8"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Export voor gebruik in andere files
window.firebaseDB = db;
window.firebaseAuth = auth;
