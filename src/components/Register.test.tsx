import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import Register from './Register';

test('renders register form', () => {
  render(
    <Provider store={store}>
      <Register />
    </Provider>
  );

  expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
});

test('validates form inputs', async () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>
    );
  

    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'user name' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    

    fireEvent.click(screen.getByLabelText(/Acepto los términos y condiciones/i));
  

    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
  

    await waitFor(() => {
      const errorMessage = screen.getByText('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.');
      expect(errorMessage).toBeInTheDocument();
    });
  });
