const express = require('express');
const router = express.Router();
const { admin, db } = require('../firebase');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(403).send('No token provided');

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized');
  }
};


router.post('/register', async (req, res) => {
  const { email, password, role = "caregiver", language, linkedUserEmail = null } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      language,
      linkedUserEmail
    });

    res.status(201).send({ uid: userRecord.uid });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send(err.message);
  }
});


router.post('/login', async (req, res) => {
  res.status(501).send('Handled client-side with Firebase Auth SDK');
});

module.exports = router;
