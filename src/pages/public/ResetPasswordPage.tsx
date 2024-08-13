import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sanitizeInput } from '../../utils/sanitize';
import { resetPassword } from '../../api/resetPassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
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
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      setError('Token no válido o expirado. Por favor, solicite un nuevo enlace de recuperación de contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword({ token, newPassword: sanitizedNewPassword });
      setSuccess('Contraseña restablecida con éxito. Serás redirigido en breve.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      setError((error as any).message ?? 'Ha ocurrido un error al intentar restablecer la contraseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <h2>Restablecer Contraseña</h2>
          {error && <Alert variant="danger" data-testid="error-message">{error}</Alert>}
          {success && <Alert variant="success" data-testid="success-message">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="form" data-testid="form-reset-password">
            <Form.Group className="my-3">
              <Form.Label htmlFor="newPassword">Nueva contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  className='eye'
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </Button>
              </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label htmlFor="confirmPassword">Confirmar nueva contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  className='eye'
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </Button>
              </InputGroup>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Restablecer contraseña'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordPage;