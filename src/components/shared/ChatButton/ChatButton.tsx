import React from 'react';
import { Link } from 'react-router-dom';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChatButtonProps {
  advertId: string;
  chatId: string | null;
}

const ChatButton: React.FC<ChatButtonProps> = ({ advertId, chatId }) => {
  return (
    <Link 
      to={chatId ? `/app/chats/${chatId}` : `/app/chats/new/${advertId}`}  
      className="chat-icon-button"
    >
      <FontAwesomeIcon icon={faComment} size="lg" />
      {chatId ? 'Continuar chat' : 'Contactar'}
    </Link>
  );
};

export default ChatButton;
