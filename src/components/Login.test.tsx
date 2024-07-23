import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import Login from './Login';

test('renders login form', () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  
  expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
});

test('validates form inputs', async () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

  await waitFor(() => {
    const errorMessage = screen.getByText('Nombre de usuario y contraseña son requeridos.');
    expect(errorMessage).toBeInTheDocument();
  });
});
