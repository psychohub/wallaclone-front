import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Wallaclone logo and navigation links', () => {
  render(<App />);

  // Verificar que el logo está en el documento
  const logoElements = screen.getAllByText(/Walla/i);
  expect(logoElements[0]).toBeInTheDocument();

  // Verificar que los enlaces de navegación están en el documento
  const registerLink = screen.getByText(/Registro/i);
  expect(registerLink).toBeInTheDocument();

  const loginLink = screen.getByText(/Login/i);
  expect(loginLink).toBeInTheDocument();
});
