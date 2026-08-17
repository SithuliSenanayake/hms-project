const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// All patient routes require login
router.use(verifyToken);

// GET /api/patients - list all patients, optional search by name
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients';
    let params = [];

    if (search) {
      query += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/patients/:id - get one patient
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/patients - create a new patient
router.post('/', async (req, res) => {
  try {
    const { name, dob, gender, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO patients (name, dob, gender, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, dob || null, gender || null, phone || null, address || null]
    );

    res.status(201).json({ id: result.insertId, name, dob, gender, phone, address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/patients/:id - update a patient
router.put('/:id', async (req, res) => {
  try {
    const { name, dob, gender, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const [result] = await db.query(
      'UPDATE patients SET name = ?, dob = ?, gender = ?, phone = ?, address = ? WHERE id = ?',
      [name, dob || null, gender || null, phone || null, address || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;