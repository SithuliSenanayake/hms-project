import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { getBills, createBill, markBillPaid } from '../services/billService';
import { getPatients } from '../services/patientService';

function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ patient_id: '', amount: '' });

  const loadAll = async () => {
    const [b, p] = await Promise.all([getBills(), getPatients()]);
    setBills(b);
    setPatients(p);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setForm({ patient_id: '', amount: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError('');
    try {
      await createBill(form);
      setShowModal(false);
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleMarkPaid = async (id) => {
    await markBillPaid(id);
    loadAll();
  };

  return (
    <Container className="p-4">
      <h2>Billing</h2>

      <Button variant="primary" className="mb-3" onClick={openAddModal}>+ Generate Bill</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.id}>
              <td>{b.patient_name}</td>
              <td>Rs. {Number(b.amount).toFixed(2)}</td>
              <td>
                <Badge bg={b.status === 'paid' ? 'success' : 'warning'}>{b.status}</Badge>
              </td>
              <td>{new Date(b.created_at).toLocaleDateString()}</td>
              <td>
                {b.status === 'unpaid' && (
                  <Button size="sm" variant="outline-success" onClick={() => handleMarkPaid(b.id)}>
                    Mark Paid
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger">{formError}</div>}

          <Form.Group className="mb-2">
            <Form.Label>Patient</Form.Label>
            <Form.Select
              value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
            >
              <option value="">Select patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Amount (Rs.)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
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

export default Billing;