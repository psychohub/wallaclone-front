import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { Anuncio } from '../../../types/adverts';
import { getChatMessages, sendChatMessage } from '../../../api/chat';
import { useAppSelector } from '../../../hooks/useStore'; 
import ChatMessages from '../../../components/chat/ChatMessages';
import ChatInput from '../../../components/chat/ChatInput';
import AdvertDetails from '../../../components/chat/AdvertDetails';
import './ChatPage.css';

interface ChatMessage {
  id: string;
  emisor: string;
  contenido: string;
  fechaEnvio: string;
}

interface IOwner { _id: string, nombre: string }

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>(); 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [advert, setAdvert] = useState<Anuncio>();
  const [advertOwner, setAdvertOwner] = useState<string>();
  
  const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (chatId && user?.id) {  
        try {
         
          const { status: chatStatus, data } = await getChatMessages(chatId);
          if (chatStatus === 200) {
            setMessages(data.mensajes);
            setAdvert(data.anuncio);
            setAdvertOwner((data.participantes as IOwner[]).find(p => p._id !== user.id)?.nombre);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [chatId, user]); 

  const handleSendMessage = async (content: string) => {
    if (chatId && user?.id) {  
      try {
       
        const { status, data: newMessage } = await sendChatMessage(chatId, content);
        if (status === 201) {
         
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          console.error('Error: No se pudo enviar el mensaje correctamente');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('No se pudo enviar el mensaje: faltan `chatId` o `user.id`');
    }
  };
  

  return (
    <div className="list-container">
      <Container className="page-title-container">
        <h2 className="page-title">Chat con {advertOwner}</h2>
      </Container>

      <Container>
        <Row>
          <Col>
            { advert && <AdvertDetails advert={advert} /> }
          </Col>
          <Col>
            <div className="chat-container">
              <ChatMessages messages={messages} />
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatPage;
