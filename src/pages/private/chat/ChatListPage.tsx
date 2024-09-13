import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../lib/axiosInstance';

interface Conversation {
    _id: string;
    anuncio: { nombre: string };
    participantes: Array<{ nombre: string; email: string }>;
}

const ChatList: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get('/chat');
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    return (
        <div className="chat-list container mt-4">
            <h1 className="chat-title">Mis Conversaciones</h1>
            <ul className="list-group">
                {conversations.map((conv) => (
                    <li key={conv._id} className="list-group-item">
                        <Link to={`/app/chats/${conv._id}`}>
                            {conv.anuncio.nombre} - {conv.participantes.map(p => p.nombre).join(', ')}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;