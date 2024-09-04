import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdvertForm from '../../components/adverts/AdvertForm';
import { createAdvert } from '../../api/adverts';
import { Card, Container } from 'react-bootstrap';

const CreateAdvertPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createAdvert(formData);
      navigate('/app/articulos'); 
    } catch (error) {
      console.error('Error al crear el anuncio:', error);
    }
  };

  return (
    <div className="page">
      <Container className="page-title-container">
        <h2 className="page-title">Crear nuevo anuncio</h2>
      </Container>
      <Card className="card-container">
        <Card.Body>
          <AdvertForm 
            mode="create" 
            onSubmit={handleSubmit} 
            onCancel={() => navigate('/app/articulos')} 
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateAdvertPage;
