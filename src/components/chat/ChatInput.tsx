import React, { useState } from 'react';
import './ChatInput.css';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Mensaje de chat"
        />
        <button className="btn btn-primary" type="submit" aria-label="Enviar mensaje">
          Enviar
        </button>
      </div>
    </form>
  );
};

export default ChatInput;