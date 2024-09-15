import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick();
    navigate('/app/chat');
  };

  return (
    <Button variant='link' onClick={handleClick} className="chat-icon-button">
      <FontAwesomeIcon icon={faComment} size="lg" />Contactar
    </Button>
  );
};

export default ChatButton;
