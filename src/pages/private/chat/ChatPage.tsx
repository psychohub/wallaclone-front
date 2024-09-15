import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Anuncio } from '../../../types/adverts';
import { Chat, ChatMessage } from '../../../types/chat';
import { getOrCreateChat, saveChatMessage } from '../../../api/chat';
import { getAdvertBySlug } from '../../../api/adverts';
import { useAppSelector } from '../../../hooks/useStore'; 
import { disconnectSocket, initiateSocket, receiveMessage, sendMessage } from '../../../hooks/useSocket';
import ChatMessages from '../../../components/chat/ChatMessages';
import ChatInput from '../../../components/chat/ChatInput';
import AdvertDetails from '../../../components/chat/AdvertDetails';
import './ChatPage.css';


const ChatPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const advertSlug = useAppSelector((state) => state.adverts.selectedAdvertSlug);
  const selectedChat = useAppSelector((state) => state.chats.selectedChat);

  const [chat, setChat] = useState<Chat>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [advert, setAdvert] = useState<Anuncio>();
  const [room, setRoom] = useState<string>();

  useEffect(() => {
    const getChat = async () => {
      if (!selectedChat) return;
      
      const response = await getOrCreateChat(selectedChat.advertId, selectedChat.ownerId, selectedChat.userId);
      if ([200, 201].includes(response.status)) {
        const chat = response.data as Chat;
        setChat(chat);
        setMessages(response.data.mensajes);
        setRoom(`${chat._id}-${chat.owner}-${chat.user}`);
      }
    };

    getChat();
  }, []);

  useEffect(() => {
    const getAdvert = async () => {
      if (!advertSlug) return;
      
      const response = await getAdvertBySlug(advertSlug);
      if ([200].includes(response.status)) {
        setAdvert(response.data);
      }
    };

    getAdvert();
  }, []);

  useEffect(() => {
    if (room) initiateSocket(room);
    receiveMessage((err: any, data: ChatMessage) => {
      if(err) return;
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      disconnectSocket();
    }
  }, [room]);

  const handleSendMessage = async (content: string) => {
    if (chat && user?.id) {  
      try {
        const { status, data: newMessage } = await saveChatMessage(chat._id, content);
        if (status === 201) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          if(room) sendMessage(room, newMessage);
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
  
  if (!advertSlug || !selectedChat) {
    return <Navigate to='/' />;
  }

  return (
    <div className="list-container">
      <Container className="page-title-container">
        <h2 className="page-title">Chat con {advert?.autor.nombre}</h2>
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
