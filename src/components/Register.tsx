import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { sanitizeInput } from '../utils/sanitize';
import { AppDispatch } from '../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateForm = () => {
    if (!/^[a-zA-Z0-9_-]+$/.test(nombre)) {
      setError('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.');
      return false;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(contraseña)) {
      setError('La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número.');
      return false;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones para registrarte.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await dispatch(registerUser({
        nombre: sanitizeInput(nombre),
        email: sanitizeInput(email),
        contraseña
      })).unwrap();
      setSuccess('Usuario registrado exitosamente.');
      setNombre('');
      setEmail('');
      setContraseña('');
      setTermsAccepted(false);
    } catch (err) {
      setError('Error al registrar. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Container fluid className="register-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span className="logo-blue">WALLA</span><span className="logo-gray">CLONE</span>
          </div>
          <h2>Registrarse</h2>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          {success && <Alert variant="success" role="alert">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="register-form">
            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type="text"
                  id="nombre"
                  placeholder="Usuario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  id="contraseña"
                  placeholder="Contraseña"
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
                label="WALLACLONE Los servicios requieren la recopilación y el procesamiento de ciertos datos personales. Confirme que ha leído y acepta los términos de nuestra Política de Privacidad."
                required
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
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
              <p>Al proceder, usted acepta nuestros <a href="#">Términos de servicio</a></p>
              <p>¿Ya tienes una cuenta? <Link to="/login">Ingresa aquí</Link></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
