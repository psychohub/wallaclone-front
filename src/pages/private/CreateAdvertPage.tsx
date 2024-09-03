import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdvertForm from '../../components/adverts/AdvertForm';
import { createAdvert } from '../../api/adverts';

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
    <div>
      <AdvertForm 
        mode="create" 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/app/articulos')} 
      />
    </div>
  );
};

export default CreateAdvertPage;
