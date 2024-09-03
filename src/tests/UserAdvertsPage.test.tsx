import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserAdvertsPage from '../pages/public/UserAdvertsPage';
import { getAdvertsByUser } from '../api/adverts';
import { AnunciosResponse } from '../types/adverts';

jest.mock('../api/adverts');

const mockGetAdvertsByUser = getAdvertsByUser as jest.MockedFunction<typeof getAdvertsByUser>;

describe('UserAdvertsPage', () => {
  beforeEach(() => {
    mockGetAdvertsByUser.mockClear();
  });

  it('renders user adverts page and fetches adverts', async () => {
    const mockAdverts: { status: number; data: AnunciosResponse } = {
      status: 200,
      data: {
        anuncios: [
          {
            _id: '1',
            nombre: 'Anuncio 1',
            slug: 'anuncio-1',
            imagen: 'imagen1.jpg',
            descripcion: 'Descripción del anuncio 1',
            precio: 100,
            tipoAnuncio: 'venta',
            tags: ['tech'],
            autor: { _id: 'user1', nombre: 'usuario1' },
            fechaPublicacion: '2023-07-01',
            estado: 'disponible'
          },
          {
            _id: '2',
            nombre: 'Anuncio 2',
            slug: 'anuncio-2',
            imagen: 'imagen2.jpg',
            descripcion: 'Descripción del anuncio 2',
            precio: 200,
            tipoAnuncio: 'búsqueda',
            tags: ['home'],
            autor: { _id: 'user1', nombre: 'usuario1' },
            fechaPublicacion: '2023-07-02',
            estado: 'disponible'
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      },
    };

    mockGetAdvertsByUser.mockResolvedValue(mockAdverts);

    render(
      <MemoryRouter initialEntries={['/anuncios/usuario/usuario1']}>
        <Routes>
          <Route path="/anuncios/usuario/:username" element={<UserAdvertsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Anuncios de usuario1')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAdvertsByUser).toHaveBeenCalledWith(expect.objectContaining({ username: 'usuario1' }));
      expect(screen.getByText('Anuncio 1')).toBeInTheDocument();
      expect(screen.getByText('Anuncio 2')).toBeInTheDocument();
    });
  });

  it('handles error when fetching adverts fails', async () => {
    mockGetAdvertsByUser.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={['/anuncios/usuario/usuario1']}>
        <Routes>
          <Route path="/anuncios/usuario/:username" element={<UserAdvertsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los anuncios. Por favor, intenta de nuevo más tarde.')).toBeInTheDocument();
    });
  });
});