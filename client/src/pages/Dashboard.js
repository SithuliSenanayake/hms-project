import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { getPatients } from '../services/patientService';
import { getAppointments } from '../services/appointmentService';
import { getBills } from '../services/billService';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [patients, appointments, bills] = await Promise.all([
          getPatients(),
          getAppointments(),
          getBills(),
        ]);

        const today = new Date().toDateString();
        const todaysAppointments = appointments.filter(
          (a) => new Date(a.appointment_date).toDateString() === today
        ).length;

        const revenue = bills
          .filter((b) => b.status === 'paid')
          .reduce((sum, b) => sum + Number(b.amount), 0);

        const unpaidCount = bills.filter((b) => b.status === 'unpaid').length;

        setStats({
          totalPatients: patients.length,
          totalAppointments: appointments.length,
          todaysAppointments,
          revenue,
          unpaidCount,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <Container className="p-4">
      <h2>Welcome, {user?.name}</h2>
      <p className="text-muted mb-4">Role: {user?.role}</p>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Row>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Total Patients</Card.Title>
                <h2>{stats.totalPatients}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Today's Appointments</Card.Title>
                <h2>{stats.todaysAppointments}</h2>
                <Card.Text className="text-muted">
                  {stats.totalAppointments} total booked
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Revenue Collected</Card.Title>
                <h2>Rs. {stats.revenue.toFixed(2)}</h2>
                <Card.Text className="text-muted">
                  {stats.unpaidCount} unpaid bill{stats.unpaidCount !== 1 ? 's' : ''}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Dashboard;