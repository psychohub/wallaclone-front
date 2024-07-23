import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const learnElement = screen.getByText(/Learn/i);
  expect(learnElement).toBeInTheDocument();

  const reactLinks = screen.getAllByRole('link', { name: /React/i });
expect(reactLinks.length).toBeGreaterThan(0);
reactLinks.forEach(link => expect(link).toBeInTheDocument());
});
