const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

// const firebaseConfig = {
//     apiKey: "AIzaSyCYDIC_xJtqMdCQpscm05rzBFqXJ-dQUxA",
//     authDomain: "user-management-system-e1045.firebaseapp.com",
//     databaseURL: "https://user-management-system-e1045-default-rtdb.firebaseio.com",
//     projectId: "user-management-system-e1045",
//     storageBucket: "user-management-system-e1045.appspot.com",
//     messagingSenderId: "224647726131",
//     appId: "1:224647726131:web:d6451b5ac414c508bfcf46",
//     measurementId: "G-5SVP4LS7S3"
// };

const firebaseConfig = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
})

const runFirebase = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    // Initialize Authentication and Firestore
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    return { auth, db };
}

module.exports = runFirebase; // This should only export the result of the function, not auth and db
