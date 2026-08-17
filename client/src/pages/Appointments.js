import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { getAppointments, createAppointment, updateAppointment } from '../services/appointmentService';
import { getPatients } from '../services/patientService';
import { getDoctors } from '../services/doctorService';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    patient_id: '', doctor_id: '', appointment_date: '', status: 'scheduled', notes: '',
  });

  const loadAll = async () => {
    const [appts, pats, docs] = await Promise.all([getAppointments(), getPatients(), getDoctors()]);
    setAppointments(appts);
    setPatients(pats);
    setDoctors(docs);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ patient_id: '', doctor_id: '', appointment_date: '', status: 'scheduled', notes: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (appt) => {
    setEditingId(appt.id);
    setForm({
      patient_id: appt.patient_id,
      doctor_id: appt.doctor_id,
      appointment_date: appt.appointment_date.slice(0, 16), // format for datetime-local input
      status: appt.status,
      notes: appt.notes || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError('');
    try {
      if (editingId) {
        await updateAppointment(editingId, form);
      } else {
        await createAppointment(form);
      }
      setShowModal(false);
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="p-4">
      <h2>Appointments</h2>

      <Button variant="primary" className="mb-3" onClick={openAddModal}>+ Book Appointment</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.patient_name}</td>
              <td>{a.doctor_name}</td>
              <td>{new Date(a.appointment_date).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => openEditModal(a)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Appointment' : 'Book Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger">{formError}</div>}

          <Form.Group className="mb-2">
            <Form.Label>Patient</Form.Label>
            <Form.Select
              value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              disabled={!!editingId}
            >
              <option value="">Select patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Doctor</Form.Label>
            <Form.Select
              value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              disabled={!!editingId}
            >
              <option value="">Select doctor...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={form.appointment_date}
              onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
            />
          </Form.Group>

          {editingId && (
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-2">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Appointments;