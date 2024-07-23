import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { sanitizeInput } from '../utils/sanitize';
import { AppDispatch } from '../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2>Registro de Usuario</h2>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          {success && <Alert variant="success" role="alert">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
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
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                label="Acepto los términos y condiciones y la política de privacidad"
                required
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <div className="footer-text mt-3">
              <p>¿Ya tienes una cuenta? <a href="#">Inicia sesión</a></p>
              <p>Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
