import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getChatMessages, sendChatMessage } from '../../api/chat';
import { useAppSelector } from '../../hooks/useStore'; 
import './ChatPage.css';

interface ChatMessage {
  id: string;
  emisor: string;
  contenido: string;
  fechaEnvio: string;
}

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>(); 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const user = useAppSelector(state => state.auth.user); 

  useEffect(() => {
    const fetchData = async () => {
      if (chatId && user?.id) {  
        try {
         
          const { status: chatStatus, data: chatMessages } = await getChatMessages(chatId);
          if (chatStatus === 200) {
            setMessages(chatMessages);
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
    <div className="chat-page container mt-4">
      <h1 className="chat-title"><span className="blue-text">Chat</span> para anuncio</h1>
      <div className="chat-content">
        <div className="chat-container">
          <ChatMessages messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
