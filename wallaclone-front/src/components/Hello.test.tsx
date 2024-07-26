import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from './Hello';

test('renders Hello component with name', () => {
  render(<Hello name="World" />);
  const element = screen.getByText(/Hello, World!/i);
  expect(element).toBeInTheDocument();
});