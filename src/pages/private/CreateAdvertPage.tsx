import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdvertForm from '../../components/adverts/AdvertForm';
import { createAdvert } from '../../api/adverts';

const CreateAdvertPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createAdvert(formData);
      navigate('/mis-anuncios'); 
    } catch (error) {
      console.error('Error al crear el anuncio:', error);
    }
  };

  return (
    <div>
      <AdvertForm 
        mode="create" 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/mis-anuncios')} 
      />
    </div>
  );
};

export default CreateAdvertPage;
