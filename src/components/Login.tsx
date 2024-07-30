import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { sanitizeInput } from '../utils/sanitize';
import { AppDispatch } from '../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
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
      await dispatch(loginUser({
        nombre: sanitizeInput(nombre),
        contraseña,
        rememberMe
      })).unwrap();
      // Redirigir al usuario o mostrar mensaje de éxito
      alert('Bienvenido al Home');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span className="logo-blue">WALLA</span><span className="logo-gray">CLONE</span>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group className="mb-3">
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
            <div className="social-login mt-3">
              <Button variant="outline-primary" className="facebook">
                <FontAwesomeIcon icon={faFacebook} /> Facebook
              </Button>
              <Button variant="outline-danger" className="google">
                <FontAwesomeIcon icon={faGoogle} /> Google
              </Button>
            </div>
            <div className="footer-text mt-3">
              <p>¿No tienes una cuenta? <Link to="/register">Registrarse</Link></p>
              <p>Al proceder, usted acepta nuestros <a href="#">Términos de servicio</a></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;