import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordPage from '../pages/public/ResetPasswordPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ token: 'test-token' }),
}));

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );
  });

  test('renders ResetPasswordPage component', () => {
    expect(screen.getByText('Restablecer Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restablecer Contraseña' })).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    });
  });

  test('shows error when password is too short', async () => {
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });
  });

  test('shows success message and redirects on successful password reset', async () => {
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(screen.getByText('Contraseña restablecida con éxito.')).toBeInTheDocument();
    });

    // Verificar que se llama a navigate después de 5 segundos
    jest.advanceTimersByTime(5000);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('disables submit button while loading', async () => {
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    expect(screen.getByRole('button', { name: 'Procesando...' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Restablecer Contraseña' })).not.toBeDisabled();
    });
  });
});