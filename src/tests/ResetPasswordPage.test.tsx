import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordPage from '../pages/public/ResetPasswordPage';
import { resetPassword } from '../api/resetPassword';

// Simular la función resetPassword
jest.mock('../api/resetPassword', () => ({
  resetPassword: jest.fn(),
}));

// Simular useNavigate y useParams
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ token: 'test-token' }),
}));

describe('Página de Restablecimiento de Contraseña', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (token: string | undefined) => {
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ token });
    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );
  };

  test('renderiza el componente de la página de restablecimiento de contraseña', () => {
    renderComponent('test-token');
    expect(screen.getByRole('heading', { name: 'Restablecer Contraseña' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restablecer Contraseña' })).toBeInTheDocument();
  });

  test('muestra un error cuando las contraseñas no coinciden', async () => {
    renderComponent('test-token');
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    });
  });

  test('muestra un error cuando la contraseña es demasiado corta', async () => {
    renderComponent('test-token');
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument();
    });
  });

  test('llama a resetPassword y muestra un mensaje de éxito en un envío exitoso', async () => {
    jest.useFakeTimers(); // Activar temporizadores falsos

    renderComponent('test-token');
    (resetPassword as jest.Mock).mockResolvedValue(undefined);

    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({ token: 'test-token', newPassword: 'newpassword123' });
      expect(screen.getByText('Contraseña restablecida con éxito. Serás redirigido en breve.')).toBeInTheDocument();
    });

    // Avanza el tiempo para la redirección
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    jest.useRealTimers(); // Volver a los temporizadores reales después de la prueba
  });

  test('muestra un mensaje de error cuando resetPassword falla', async () => {
    renderComponent('test-token');
    (resetPassword as jest.Mock).mockRejectedValue(new Error('Error al restablecer la contraseña'));

    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restablecer Contraseña' }));

    await waitFor(() => {
      expect(screen.getByText('Error al restablecer la contraseña')).toBeInTheDocument();
    });
  });

  test('deshabilita el botón de envío mientras se carga', async () => {
    jest.useFakeTimers();
    renderComponent('test-token');
    (resetPassword as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
  
    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'newpassword123' } });
    
    const submitButton = screen.getByRole('button', { name: 'Restablecer Contraseña' });
    fireEvent.click(submitButton);
  
    // Verifica que el botón cambia a "Procesando..." y está deshabilitado
    expect(screen.getByRole('button', { name: 'Procesando...' })).toBeDisabled();
  
    // Avanza los temporizadores
    jest.advanceTimersByTime(1000);
  
    // Espera a que el botón vuelva a su estado original
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Restablecer Contraseña' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Restablecer Contraseña' })).not.toBeDisabled();
    });
  
    jest.useRealTimers();
  });

  test('muestra un error cuando falta el token', async () => {
    renderComponent(undefined); // Llama a renderComponent sin token

    fireEvent.change(screen.getByLabelText('Nueva Contraseña'), { target: { value: 'newpassword123' } });
    fireEvent.change(screen.getByLabelText('Confirmar Nueva Contraseña'), { target: { value: 'newpassword123' } });
    
    const submitButton = screen.getByRole('button', { name: 'Restablecer Contraseña' });
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Token no válido o expirado. Por favor, solicite un nuevo enlace de recuperación de contraseña.')).toBeInTheDocument();
    });
  });
});
