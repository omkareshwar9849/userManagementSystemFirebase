const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const jwt = require("jsonwebtoken");
const { collection, doc, getDocs, updateDoc, deleteDoc } = require("firebase/firestore");

const runFirebase = require("../firebase");
const fire = runFirebase();
const db = fire.db;

router.get("/profile",fetchuser, async (req, res) => {
    const idToken = req.header("Authorization");
    if (!idToken) {
      res.status(401).json({ error: "Authorization token missing" });
      return;
    }
    try {
      // Verify the Firebase Auth token
      const decodedToken = jwt.decode(idToken);
      // Retrieve the user's profile information from Firestore
      const userEmail = decodedToken.email
  
      const userQuery = collection(db, "users");
      const querySnapshot = await getDocs(userQuery);
      let userProfile;
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email === userEmail) {
          userProfile = {
            username: userData.username,
            email: userData.email,
            fullName: userData.fullName,
          };
        }
      });
  
      if (userProfile) {
        res.status(200).json(userProfile);
      } else {
        res.status(404).json({ error: "User not found" });
      }
  
    } catch (error) {
      console.error("Error retrieving user profile:", error);
      res.status(500).json({ error: "Failed to retrieve user profile" });
    }
  });
  
router.put("/profile",fetchuser, async (req, res) => {
    const idToken = req.header("Authorization");
    if (!idToken) {
      res.status(401).json({ error: "Authorization token missing" });
      return;
    }
    try {
      // Verify the Firebase Auth token
      const decodedToken = jwt.decode(req.header("Authorization"));
      // Retrieve the user's email from the token
      const userEmail = decodedToken.email;
      // Get the user's Firestore document ID based on their email
      const userQuery = collection(db, "users");
      const querySnapshot = await getDocs(userQuery);
      let userDocId;
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email === userEmail) {
          userDocId = doc.id;
        }
      });
  
      if (!userDocId) {
        res.status(404).json({ error: "User not found" });
        return;
      }
  
      // Update user profile information in Firestore
      const { username, email, fullName } = req.body;
      const userRef = doc(db, "users", userDocId);
  
      await updateDoc(userRef, {
        username,
        email,
        fullName,
      });
      res.status(200).json({ message: "User profile updated successfully", username: username, email: email, fullName: fullName, AuthToken: idToken });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });
  
router.delete("/delete",fetchuser, async (req, res) => {
    const idToken = req.header("Authorization");
  
    if (!idToken) {
      res.status(401).json({ error: "Authorization token missing" });
      return;
    }
  
    try {
      // Verify the Firebase Auth token
      const decodedToken = jwt.decode(idToken);
      // Retrieve the user's email from the token
      const userEmail = decodedToken.email;
  
      // Get the user's Firestore document ID based on their email
      const userQuery = collection(db, "users");
      const querySnapshot = await getDocs(userQuery);
      let userDocId;
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.email === userEmail) {
          userDocId = doc.id;
        }
      });
  
      if (!userDocId) {
        res.status(404).json({ error: "User not found" });
        return;
      }
  
      // Delete the user's profile document in Firestore
      const userRef = doc(db, "users", userDocId);
      await deleteDoc(userRef);
  
      // Delete the user's Firebase Authentication account
      // await admin.auth().deleteUser(decodedToken.uid);
  
      res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ error: "Failed to delete user account" });
    }
  });

module.exports = router;