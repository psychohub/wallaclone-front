import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/features/auth/authSlice';
import { sanitizeInput } from '../../utils/sanitize';
import { AppDispatch } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await dispatch(loginUser({
        nombre: sanitizeInput(nombre),
        contraseña,
        rememberMe
      }));
      
      if ([200, 201].includes((response.payload as any).status)) {
        navigate('/');
      } else {
        setError('Usuario y/o contraseña incorrectas.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <div>
            <h2>Inicio de sesión</h2>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="form">
            <Form.Group className="my-3">
              <Form.Label htmlFor="nombre">Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="contraseña">Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  id="contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
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
              <Form.Check
                type="checkbox"
                label="Recuérdame"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
            <div className="footer-text mt-3">
              <p>¿No tienes una cuenta? <Link to="/register">Regístrate</Link></p>
              <p><Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;