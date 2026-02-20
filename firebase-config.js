// Firebase configuratie - EpsteinUnited project (Firebase v9.6.1 compat)
const firebaseConfig = {
    apiKey: "AIzaSyAt-n2A_3FH9rY-XtsdfuHTgjtJQHIxqAY",
    authDomain: "epsteinunited.firebaseapp.com",
    projectId: "epsteinunited",
    storageBucket: "epsteinunited.appspot.com",
    messagingSenderId: "603988196357",
    appId: "1:603988196357:web:203e9451d880aafe63b06c"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Export voor gebruik in andere files
window.firebaseDB = db;
window.firebaseAuth = auth;

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBz2FL1s2d8KsYcH-QFMCx3RZWA_32BQUg",
  authDomain: "epstein-united.firebaseapp.com",
  projectId: "epstein-united",
  storageBucket: "epstein-united.firebasestorage.app",
  messagingSenderId: "1018415762457",
  appId: "1:1018415762457:web:9492a507e5b0c612a0ae88",
  measurementId: "G-FWZF62HZ2X"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export voor gebruik in andere files
window.firebaseDB = db;
window.firebaseApp = app;
