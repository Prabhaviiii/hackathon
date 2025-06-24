const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// GET /api/caregivers
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'caregiver').get();
    const caregivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(caregivers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /api/caregivers/user/:email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'caregiver')
      .where('linkedUserEmail', '==', email)
      .get();

    const caregivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(caregivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
