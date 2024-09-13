import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../hooks/useStore';
import './ChatMessages.css';

interface ChatMessage {
  id: string;
  emisor: string;
  contenido: string;
  fechaEnvio: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-messages" aria-live="polite">
      {messages.map((message) => (
        <div
          key={`message-${message.id}`} 
          className={`message ${message.emisor === currentUser?.id ? 'sent' : 'received'}`}
        >
          <div className="message-content">
            {message.contenido}
          </div>
          <div className="message-timestamp">
            {new Date(message.fechaEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
