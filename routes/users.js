const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// GET /api/users — get all users with role == "user"
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'user').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
