import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { io, Socket } from "socket.io-client";
import { Anuncio } from '../../../types/adverts';
import { ChatMessage } from '../../../types/chat';
import { ClientToServerEvents, ServerToClientEvents } from '../../../types/socket';
import { getChatMessages, sendChatMessage } from '../../../api/chat';
import { useAppSelector } from '../../../hooks/useStore'; 
import ChatMessages from '../../../components/chat/ChatMessages';
import ChatInput from '../../../components/chat/ChatInput';
import AdvertDetails from '../../../components/chat/AdvertDetails';
import { API_BASE_URL } from '../../../config/environment';
import './ChatPage.css';
import { disconnectSocket, initiateSocket, receiveMessage, sendMessage } from '../../../hooks/useSocket';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_BASE_URL);

interface IOwner { _id: string, nombre: string }

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>(); 
  const user = useAppSelector(state => state.auth.user);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [advert, setAdvert] = useState<Anuncio>();
  const [advertOwner, setAdvertOwner] = useState<string>();
  const [room, setRoom] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      if (chatId && user?.id) {  
        try {
          const { status: chatStatus, data } = await getChatMessages(chatId);
          if (chatStatus === 200) {
            setMessages(data.mensajes);
            setAdvert(data.anuncio);
            
            const ownerUsername = (data.participantes as IOwner[]).find(p => p._id === data.anuncio.autor)?.nombre;
            setAdvertOwner(ownerUsername);

            const userUsername = (data.participantes as IOwner[]).find(p => p._id !== data.anuncio.autor)?.nombre;
            setRoom(`${data.anuncio?._id}-${ownerUsername}-${userUsername}`);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [chatId, user]);

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
    if (chatId && user?.id) {  
      try {
        const { status, data: newMessage } = await sendChatMessage(chatId, content);
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
