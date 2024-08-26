import React from 'react';
import { useParams } from 'react-router-dom';
import AdvertForm from '../../components/adverts/AdvertForm';
import { editAdvert } from '../../api/adverts';

const EditAdvertPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
    try {
      await editAdvert(id, formData);
      // Navegar de vuelta a la lista de anuncios o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al actualizar el anuncio:', error);
      // Manejar el error (mostrar un mensaje al usuario, etc.)
    }
  };

  return (
    <div>
      <h1>Editar anuncio</h1>
      <AdvertForm 
        mode="edit" 
        anuncioId={id} 
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditAdvertPage;