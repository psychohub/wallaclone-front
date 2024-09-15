import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAppDispatch } from '../../../hooks/useStore';
import { setSelectedChat } from '../../../store/features/chats/chatsSlice';
import { setSelectedAdvertSlug } from '../../../store/features/adverts/advertsSlice';
import { Chat } from '../../../types/chat';
import { getAllMyChats } from '../../../api/chat';


const ChatList: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await getAllMyChats();
                setChats(response.data.results);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    const handleClick = (chat: Chat) => {
        dispatch(setSelectedChat({
            id: chat._id,
            advertId: chat.anuncio._id,
            ownerId: chat.owner._id,
            userId: chat.user._id,
        }));
        dispatch(setSelectedAdvertSlug(chat.anuncio.slug));
        navigate('/app/chat');
    };

    return (
        <div className="chat-list container mt-4">
            <h1 className="chat-title">Mis Conversaciones</h1>
            <ul className="list-group">
                {
                    (chats && chats.length === 0) &&
                    <p>Aún no tienes conversaciones activas.</p>
                }
                {chats.map((chat) => (
                    <li key={chat._id} className="list-group-item">
                        <Button variant='link' onClick={() => handleClick(chat)}>
                            {`${chat.anuncio.nombre} - ${chat.owner.nombre} - ${chat.user.nombre}`}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;