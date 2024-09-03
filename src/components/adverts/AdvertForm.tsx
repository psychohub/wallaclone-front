import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getAdvertBySlug } from '../../api/adverts';
import { Anuncio } from '../../types/adverts';
import Loader from '../loader/Loader';

interface AdvertFormProps {
  mode: 'create' | 'edit';
  anuncioSlug?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}

const AdvertForm: React.FC<AdvertFormProps> = ({ mode, anuncioSlug, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Anuncio>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    tipoAnuncio: 'venta',
    tags: [],
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAdvert = useCallback(async () => {
    if (mode === 'edit' && anuncioSlug) {
      try {
        setLoading(true);
        const response = await getAdvertBySlug(anuncioSlug);
        const advert = response.data;
        if (advert) {
          setFormData({
            nombre: advert.nombre,
            descripcion: advert.descripcion,
            precio: advert.precio,
            tipoAnuncio: advert.tipoAnuncio,
            tags: advert.tags,
          });
        } else {
          setError('No advert data returned from API');
        }
      } catch (error) {
        setError('Error al cargar el anuncio');
      } finally {
        setLoading(false);
      }
    }
  }, [mode, anuncioSlug]);

  useEffect(() => {
    loadAdvert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'tags' ? (value as string).split(',').map((tag) => tag.trim()) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, value?.toString() || '');
        }
      });

      if (image) {
        formDataToSend.append('imagen', image);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      setError('Error al guardar el anuncio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de anuncio</Form.Label>
              <Form.Select
                name="tipoAnuncio"
                value={formData.tipoAnuncio}
                onChange={handleChange}
                required
              >
                <option value="venta">Venta</option>
                <option value="búsqueda">Búsqueda</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tags (separados por comas)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags?.join(', ')}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </Form.Group>
        {error && <div className="text-danger mb-3">{error}</div>}
        <div className="d-flex justify-content-between">
          <Button variant="danger" onClick={onCancel}>
            Regresar al listado
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar anuncio'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdvertForm;
