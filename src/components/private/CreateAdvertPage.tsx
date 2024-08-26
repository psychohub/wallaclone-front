import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdvertForm from '../../components/adverts/AdvertForm';
import { createAdvert } from '../../api/adverts';

const CreateAdvertPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createAdvert(formData);
      navigate('/mis-anuncios'); // Redirige a la lista de anuncios después de crear
    } catch (error) {
      console.error('Error al crear el anuncio:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <div>
      <h1>Crear nuevo anuncio</h1>
      <AdvertForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateAdvertPage;