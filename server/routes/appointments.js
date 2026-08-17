const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// GET /api/appointments - list all, with patient + doctor names joined in
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT appointments.id, appointments.appointment_date, appointments.status, appointments.notes,
             patients.name AS patient_name, patients.id AS patient_id,
             users.name AS doctor_name, doctors.id AS doctor_id
      FROM appointments
      JOIN patients ON appointments.patient_id = patients.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      JOIN users ON doctors.user_id = users.id
      ORDER BY appointments.appointment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/appointments - book a new appointment
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, notes } = req.body;

    if (!patient_id || !doctor_id || !appointment_date) {
      return res.status(400).json({ message: 'Patient, doctor, and date are required' });
    }

    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, notes) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, notes || null]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/appointments/:id - update status (cancel/complete) or reschedule
router.put('/:id', async (req, res) => {
  try {
    const { appointment_date, status, notes } = req.body;

    const [result] = await db.query(
      'UPDATE appointments SET appointment_date = ?, status = ?, notes = ? WHERE id = ?',
      [appointment_date, status, notes || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;