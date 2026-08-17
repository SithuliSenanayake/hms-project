const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/bills - list all bills, with patient name joined in
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT bills.id, bills.amount, bills.status, bills.created_at,
             patients.name AS patient_name, patients.id AS patient_id,
             bills.appointment_id
      FROM bills
      JOIN patients ON bills.patient_id = patients.id
      ORDER BY bills.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/bills - generate a new bill
router.post('/', async (req, res) => {
  try {
    const { patient_id, appointment_id, amount } = req.body;

    if (!patient_id || !amount) {
      return res.status(400).json({ message: 'Patient and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const [result] = await db.query(
      'INSERT INTO bills (patient_id, appointment_id, amount) VALUES (?, ?, ?)',
      [patient_id, appointment_id || null, amount]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/bills/:id/pay - mark a bill as paid
router.put('/:id/pay', async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE bills SET status = 'paid' WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ message: 'Bill marked as paid' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;