import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { getPatients, createPatient, updatePatient } from '../services/patientService';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', dob: '', gender: '', phone: '', address: '' });
  const [formError, setFormError] = useState('');

  const loadPatients = async () => {
    const data = await getPatients(search);
    setPatients(data);
  };

  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadPatients();
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: '', dob: '', gender: '', phone: '', address: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setEditingId(patient.id);
    setForm({
      name: patient.name,
      dob: patient.dob ? patient.dob.split('T')[0] : '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      address: patient.address || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError('');
    try {
        if (editingId) {
        await updatePatient(editingId, form);
        } else {
        await createPatient(form);
        }
        setShowModal(false);
        loadPatients();
    } catch (err) {
        setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="p-4">
      <h2>Patients</h2>

      <Form className="d-flex mb-3" onSubmit={handleSearch}>
        <Form.Control
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
        <Button type="submit" variant="secondary" className="me-2">Search</Button>
        <Button variant="primary" onClick={openAddModal}>+ Add Patient</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.dob ? p.dob.split('T')[0] : '-'}</td>
              <td>{p.gender || '-'}</td>
              <td>{p.phone || '-'}</td>
              <td>{p.address || '-'}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => openEditModal(p)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Patient' : 'Add Patient'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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

export default Patients;