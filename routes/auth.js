const express = require('express');
const router = express.Router();

// Import Firebase Authentication functions
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { collection, addDoc } = require("firebase/firestore");


const runFirebase = require("../firebase")
const fire = runFirebase();
const auth = fire.auth;
const db = fire.db;



router.post("/register", async (req, res) => {
    const { username, email, fullName, password } = req.body;
    try {
        // Create a user using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in Firestore
        const userDoc = {
            username,
            email,
            fullName,
            created_at: new Date(),
        };

        // Add user information to the Firestore database (you should import Firestore-related functions)
        const docRef = await addDoc(collection(db, "users"), userDoc);

        // You can get the Firebase Auth token like this
        const idToken = await user.getIdToken();

        res.status(201).json({ message: "User registered successfully", userId: user.uid, AuthToken: idToken });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sign in the user using Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the Firebase Auth token
        const idToken = await user.getIdToken();
        res.status(200).json({ message: "Login successful", AuthToken: idToken });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(401).json({ error: "Login failed" });
    }
});

module.exports = router;
