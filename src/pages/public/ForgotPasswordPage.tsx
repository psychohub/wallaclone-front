import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../../utils/sanitize';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const sanitizedEmail = sanitizeInput(email);

    if (!isValidEmail(sanitizedEmail)) {
      console.log('Invalid email:', sanitizedEmail);
      setError('Por favor, introduce una dirección de email válida.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/recuperar-contrasena`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: sanitizedEmail }),
      });

      if (response.ok) {
        setSuccess('Se ha enviado un email con instrucciones para recuperar tu contraseña.');
        setTimeout(() => navigate('/login'), 5000);
      } else {
        const data = await response.json();
        setError(data.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="recuperar-contrasena-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-blue">WALLA</span><span className="logo-gray">CLONE</span>
          </div>
          <h2 className="text-center mb-4">Recuperar Contraseña</h2>
          {error && <Alert variant="danger" data-testid="error-message">{error}</Alert>}
          {success && <Alert variant="success" data-testid="success-message">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="recuperar-contrasena-form" data-testid="form-recovery">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Recuperar Contraseña'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <p>Introduce tu dirección de email y te enviaremos instrucciones para recuperar tu contraseña.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordPage;
