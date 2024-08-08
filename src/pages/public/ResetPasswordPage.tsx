import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { sanitizeInput } from '../../utils/sanitize';
// import { resetPassword } from '../../api/resetPassword'; // Descomentar cuando BE esté listo

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Comentado para hacer pruebas 
 /* const { token } = useParams<{ token: string }>();*/
 const token = "reset_" + Math.random().toString(36).substr(2, 9);

  const validatePassword = (password: string): boolean => {
    // lógica de validación de contraseña 
    return password.length >= 6; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const sanitizedNewPassword = sanitizeInput(newPassword);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

    if (!validatePassword(sanitizedNewPassword)) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setIsLoading(false);
      return;
    }

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      // Descomentar y actualizar cuando BE esté listo
      // await resetPassword({ token, newPassword: sanitizedNewPassword });
      console.log('Password reset request sent with token:', token);
      setSuccess('Contraseña restablecida con éxito.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      setError((error as Error).message ?? 'Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="restablecer-contrasena-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-blue">WALLA</span><span className="logo-gray">CLONE</span>
          </div>
          <h2 className="text-center mb-4">Restablecer Contraseña</h2>
          {error && <Alert variant="danger" data-testid="error-message">{error}</Alert>}
          {success && <Alert variant="success" data-testid="success-message">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="restablecer-contrasena-form" data-testid="form-reset-password">
            <Form.Group className="mb-3">
              <Form.Label htmlFor="newPassword">Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordPage;