import { Container, Card, Row, Col } from 'react-bootstrap';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container className="p-4">
      <h2>Welcome, {user?.name}</h2>
      <p className="text-muted mb-4">Role: {user?.role}</p>

      <Row>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text>Manage patient records</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Appointments</Card.Title>
              <Card.Text>Schedule and track appointments</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Billing</Card.Title>
              <Card.Text>Generate and manage bills</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;