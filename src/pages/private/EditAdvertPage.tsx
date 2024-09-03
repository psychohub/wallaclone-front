import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdvertForm from '../../components/adverts/AdvertForm';
import { editAdvert, getAdvertBySlug } from '../../api/adverts';

const EditAdvertPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [advertId, setAdvertId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadAdvert = async () => {
      if (!slug) return;

      try {
        const response = await getAdvertBySlug(slug);
        if (response.data) {
          setAdvertId(response.data._id);
        } else {
          console.error('No advert data returned from API');
        }
      } catch (error) {
        console.error('Error fetching advert:', error);
      }
    };

    loadAdvert();
  }, [slug]);

  const handleSubmit = async (formData: FormData) => {
    if (!advertId) return;

    try {
      await editAdvert(advertId, formData);
      navigate('/app/articulos', { state: { message: 'Anuncio actualizado con éxito' } });
    } catch (error) {
      console.error('Error al actualizar el anuncio:', error);
    }
  };

  return (
    <div>
      <AdvertForm 
        mode="edit" 
        anuncioSlug={slug}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/app/articulos')} 
      />
    </div>
  );
};

export default EditAdvertPage;
