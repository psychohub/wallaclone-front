import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from '../lib/axiosInstance';
import MockAdapter from 'axios-mock-adapter';
import AdList from '../components/AdList';
import { API_BASE_URL } from '../config/environment';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { BrowserRouter as Router } from 'react-router-dom';

const mock = new MockAdapter(axios);

const mockResponsePage1 = {
  anuncios: [
    {
      _id: '1',
      nombre: 'Producto 1',
      imagen: 'imagen1.jpg',
      descripcion: 'Descripción del producto 1',
      precio: 100,
      tipoAnuncio: 'venta',
      tags: ['tag1', 'tag2'],
      autor: { _id: 'autor1', nombre: 'Autor 1' },
      fechaPublicacion: '2024-07-23T18:25:43.511Z',
    },
    {
      _id: '2',
      nombre: 'Producto 2',
      imagen: 'imagen2.jpg',
      descripcion: 'Descripción del producto 2',
      precio: 200,
      tipoAnuncio: 'búsqueda',
      tags: ['tag3', 'tag4'],
      autor: { _id: 'autor2', nombre: 'Autor 2' },
      fechaPublicacion: '2024-07-22T18:25:43.511Z',
    },
  ],
  total: 4,
  page: 1,
  totalPages: 2,
};

const mockResponsePage2 = {
  anuncios: [
    {
      _id: '3',
      nombre: 'Producto 3',
      imagen: 'imagen3.jpg',
      descripcion: 'Descripción del producto 3',
      precio: 150,
      tipoAnuncio: 'venta',
      tags: ['tag5', 'tag6'],
      autor: { _id: 'autor3', nombre: 'Autor 3' },
      fechaPublicacion: '2024-07-21T18:25:43.511Z',
    },
    {
      _id: '4',
      nombre: 'Producto 4',
      imagen: 'imagen4.jpg',
      descripcion: 'Descripción del producto 4',
      precio: 250,
      tipoAnuncio: 'búsqueda',
      tags: ['tag7', 'tag8'],
      autor: { _id: 'autor4', nombre: 'Autor 4' },
      fechaPublicacion: '2024-07-20T18:25:43.511Z',
    },
  ],
  total: 4,
  page: 2,
  totalPages: 2,
};

beforeEach(() => {
  mock.onGet(`${API_BASE_URL}/api/anuncios`).reply((config) => {
    const params = new URLSearchParams(config.params);
    const page = params.get('page') || '1';
    const limit = params.get('limit') || '12';

    if (page === '1') {
      return [200, mockResponsePage1];
    } else if (page === '2') {
      return [200, mockResponsePage2];
    }
    return [200, { anuncios: [], total: 0, page: Number(page), totalPages: 0 }];
  });
});

afterEach(() => {
  mock.reset();
});

describe('AdList Component', () => {
  test('renders the AdList component and checks the first ad', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AdList />
        </Router>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Producto 1')).toBeInTheDocument());

    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto 1')).toBeInTheDocument();
    expect(screen.getByText('Precio: 100€')).toBeInTheDocument();
    expect(screen.getByText('Tipo: venta')).toBeInTheDocument();
    expect(screen.getByText('Autor: Autor 1')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element !== null && element.tagName.toLowerCase() === 'p' && /tag1, tag2/.test(content);
    })).toBeInTheDocument();
  });

  test('renders the AdList component and checks the second ad', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AdList />
        </Router>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Producto 2')).toBeInTheDocument());

    expect(screen.getByText('Producto 2')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto 2')).toBeInTheDocument();
    expect(screen.getByText('Precio: 200€')).toBeInTheDocument();
    expect(screen.getByText('Tipo: búsqueda')).toBeInTheDocument();
    expect(screen.getByText('Autor: Autor 2')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element !== null && element.tagName.toLowerCase() === 'p' && /tag3, tag4/.test(content);
    })).toBeInTheDocument();
  });

  test('checks pagination', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AdList />
        </Router>
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Producto 1')).toBeInTheDocument());

    expect(screen.getByText('Siguiente')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => expect(screen.getByText('Producto 3')).toBeInTheDocument());
  });

  test('handles loading state', async () => {
    render(
      <Provider store={store}>
        <Router>
          <AdList />
        </Router>
      </Provider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  test('handles error state', async () => {
    mock.onGet(`${API_BASE_URL}/api/anuncios`).reply(500);

    render(
      <Provider store={store}>
        <Router>
          <AdList />
        </Router>
      </Provider>
    );

    await waitFor(() => {
      const errorElement = screen.getByText((content, element) => {
        return element !== null && /Error al cargar los anuncios/.test(content);
      });
      expect(errorElement).toBeInTheDocument();
    });
  });
});
