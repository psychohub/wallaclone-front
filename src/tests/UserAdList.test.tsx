
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserAdList from '../components/UserAdList';
import axios from '../lib/axiosInstance';
import { API_BASE_URL } from '../config/environment';

// Mock axios
jest.mock('../lib/axiosInstance');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de CategoryFilter
jest.mock('./CategoryFilter', () => {
  return function DummyCategoryFilter({ onChange }: { onChange: (categories: string[]) => void }) {
    return <div data-testid="category-filter" onClick={() => onChange(['tech'])}>Category Filter</div>;
  };
});

// Configurar mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('UserAdList Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { nombre: 'testUser' },
        isLoading: false,
        error: null
      }
    });

    // Mock de la respuesta de axios
    mockedAxios.get.mockResolvedValue({
      data: {
        anuncios: [
          { _id: '1', nombre: 'Anuncio 1', descripcion: 'Desc 1', precio: 100, tipoAnuncio: 'venta', tags: ['tech'], imagen: 'imagen1.jpg' },
          { _id: '2', nombre: 'Anuncio 2', descripcion: 'Desc 2', precio: 200, tipoAnuncio: 'búsqueda', tags: ['home'], imagen: 'imagen2.jpg' }
        ],
        total: 2,
        page: 1,
        totalPages: 1
      }
    });
  });

  it('renders UserAdList and displays anuncios', async () => {
    render(
      <Provider store={store}>
        <UserAdList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Mis Anuncios')).toBeInTheDocument();
      expect(screen.getByText('Anuncio 1')).toBeInTheDocument();
      expect(screen.getByText('Anuncio 2')).toBeInTheDocument();
    });
  });

  it('allows filtering by search term', async () => {
    render(
      <Provider store={store}>
        <UserAdList />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Buscar anuncios...');
    fireEvent.change(searchInput, { target: { value: 'Anuncio 1' } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/perfil/testUser/anuncios`,
        expect.objectContaining({
          params: expect.objectContaining({ nombre: 'Anuncio 1' })
        })
      );
    });
  });

  it('allows changing anuncio type', async () => {
    render(
      <Provider store={store}>
        <UserAdList />
      </Provider>
    );

    const typeSelect = screen.getByLabelText('Tipo:');
    fireEvent.change(typeSelect, { target: { value: 'venta' } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/perfil/testUser/anuncios`,
        expect.objectContaining({
          params: expect.objectContaining({ tipoAnuncio: 'venta' })
        })
      );
    });
  });

  it('allows changing sort order', async () => {
    render(
      <Provider store={store}>
        <UserAdList />
      </Provider>
    );

    const sortSelect = screen.getByLabelText('Ordenar por:');
    fireEvent.change(sortSelect, { target: { value: 'asc' } });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/perfil/testUser/anuncios`,
        expect.objectContaining({
          params: expect.objectContaining({ sort: 'asc' })
        })
      );
    });
  });

  it('handles error state', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <Provider store={store}>
        <UserAdList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar los anuncios/)).toBeInTheDocument();
    });
  });
});