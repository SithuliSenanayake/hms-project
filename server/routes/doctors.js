const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/doctors - list all doctors (joined with user name)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT doctors.id, users.name, doctors.specialty, doctors.department
      FROM doctors
      JOIN users ON doctors.user_id = users.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;