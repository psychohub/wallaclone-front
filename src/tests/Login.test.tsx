import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../pages/LoginPage';

const mockStore = configureStore([]);
const store = mockStore({});

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    expect(screen.getByLabelText(/Nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    fireEvent.change(screen.getByLabelText(/Nombre de usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
  });
});
