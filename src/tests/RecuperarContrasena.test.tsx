import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecuperarContrasena, { isValidEmail } from '../pages/public/ForgotPasswordPage';
import '@testing-library/jest-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Email enviado' }),
  })
) as jest.Mock;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <RecuperarContrasena />
    </BrowserRouter>
  );

describe('RecuperarContrasena', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renderiza correctamente', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Recuperar Contraseña' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recuperar Contraseña' })).toBeInTheDocument();
  });

  test('muestra error cuando se ingresa un email inválido', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      console.log('DOM Snapshot:');
      console.log(screen.debug());
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Por favor, introduce una dirección de email válida.');
    });
  });

  test('envía solicitud de recuperación de contraseña cuando se ingresa un email válido', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/auth/recuperar-contrasena`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com' }),
        })
      );
      const successMessage = screen.getByTestId('success-message');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveTextContent('Se ha enviado un email con instrucciones para recuperar tu contraseña.');
    });
  });

  test('muestra error cuando la solicitud falla', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Error en el servidor' }),
      })
    );

    renderComponent();
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Error en el servidor');
    });
  });

  test('deshabilita el botón durante el envío', async () => {
    renderComponent();
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Recuperar Contraseña' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Enviando...');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Recuperar Contraseña');
    });
  });
});

describe('isValidEmail', () => {
  test('valida correctamente direcciones de email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@example')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
  });
});
