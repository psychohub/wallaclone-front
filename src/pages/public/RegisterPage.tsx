import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/features/auth/authSlice';
import { sanitizeInput } from '../../utils/sanitize';
import { AppDispatch } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
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
      const response = await dispatch(registerUser({
        nombre: sanitizeInput(nombre),
        email: sanitizeInput(email),
        contraseña
      }));
      
      if ([200, 201].includes((response.payload as any).status)) {
        setSuccess('Usuario registrado exitosamente.');
        setNombre('');
        setEmail('');
        setContraseña('');
        setTermsAccepted(false);

        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError('Error al registrar.');
      }
    } catch (err) {
      setError('Error al registrar. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="form-container">
          <h2>Registro</h2>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          {success && <Alert variant="success" role="alert">{success}</Alert>}
          <Form onSubmit={handleSubmit} className="form">
            <Form.Group className="my-3">
              <Form.Label htmlFor="nombre">Usuario</Form.Label>
              <Form.Control
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Correo electrónico</Form.Label>
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
                  className='eye'
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Los servicios requieren la recopilación y el procesamiento de ciertos datos personales. Confirma que has leído y aceptas los términos de nuestra Política de Privacidad."
                required
                id="terms"
                className='small'
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <div className="footer-text mt-3">
              <p>Al proceder, aceptas nuestros <a href="#">Términos de servicio</a></p>
              <p>¿Ya tienes una cuenta? <Link to="/login">Ingresa aquí</Link></p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
