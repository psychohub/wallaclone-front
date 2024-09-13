import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChatIdByAdvertId, createChat } from '../../../api/chat';
import { useAppSelector } from '../../../hooks/useStore';
import Loader from '../../../components/loader/Loader';

const CreateChatPage: React.FC = () => {
  const { advertId } = useParams<{ advertId: string }>();
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createOrFetchChat = async () => {
      if (!advertId || !user?.id) {
        setError('Falta información necesaria para crear el chat.');
        setLoading(false);
        return;
      }
  
      try {
        const { status, data: chatId } = await getChatIdByAdvertId(advertId);
        if (status === 200 && chatId) {
          navigate(`/app/chats/${chatId}`);
        } else if (status === 404) {
          const { status: createStatus, data: newChatId } = await createChat(advertId);
          if (createStatus === 201 && newChatId) {
            navigate(`/app/chats/${newChatId}`);
          } else {
            setError('Error al crear el chat. Por favor, inténtelo de nuevo.');
          }
        } else {
          setError('Error al obtener el chat. Por favor, inténtelo de nuevo.');
        }
      } catch (error: any) {
        setError(error.message || 'Error al obtener o crear el chat. Por favor, inténtelo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
  
    createOrFetchChat();
  }, [advertId, user, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Redireccionando al chat...</div>;
};

export default CreateChatPage;