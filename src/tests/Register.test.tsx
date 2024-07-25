import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../components/Register';
import { Provider } from 'react-redux';
import {store} from '../app/store';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Register Component', () => {
  test('renders register form', () => {
    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );
    expect(screen.getByPlaceholderText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
  });

  test('validates form inputs', () => {
    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/Usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
  
  });
});
