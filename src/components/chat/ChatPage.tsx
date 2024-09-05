import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import AdvertDetails from './AdvertDetails';
import { getChatMessages, sendChatMessage } from '../../api/chat';
import { getAdvertById } from '../../api/adverts';
import { Anuncio } from '../../types/adverts';
import { useAppSelector } from '../../hooks/useStore'; 
import './ChatPage.css';

interface ChatMessage {
  id: string;
  emisor: string;
  contenido: string;
  fechaEnvio: string;
}

const ChatPage: React.FC = () => {
  const { anuncioId } = useParams<{ anuncioId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [advert, setAdvert] = useState<Anuncio | null>(null);
  const user = useAppSelector(state => state.auth.user); 

  useEffect(() => {
    const fetchData = async () => {
      if (anuncioId && user) { 
        try {
          const { status: chatStatus, data: chatMessages } = await getChatMessages(anuncioId);
          if (chatStatus === 200) {
            setMessages(chatMessages);
          }
          const { status: advertStatus, data: advertData } = await getAdvertById(anuncioId);
          if (advertStatus === 200) {
            setAdvert(advertData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [anuncioId, user]);  

  const handleSendMessage = async (content: string) => {
    if (anuncioId && user) {  
      try {
        const { status, data: newMessage } = await sendChatMessage(anuncioId, content);
        if (status === 200) {
          setMessages([...messages, newMessage]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-page container mt-4">
      <h1 className="chat-title"><span className="blue-text">Chat</span> para anuncio</h1>
      <div className="chat-content">
        <div className="advert-details">
          {advert && <AdvertDetails advert={advert} />}
        </div>
        <div className="chat-container">
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;