import axios from '../lib/axiosInstance';

export const getChatMessages = async (chatId: string) => {
  try {
      const response = await axios.get(`/chat/${chatId}`);
      return {
          status: response.status,
          data: response.data.mensajes
      };
  } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};

export const sendChatMessage = async (chatId: string, content: string) => {
  try {
    const response = await axios.post('/chat', { chatId, contenido: content }); 
    return {
      status: response.status,
      data: response.data.chat.mensajes[response.data.chat.mensajes.length - 1]
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};

export const getChatIdByAdvertId = async (advertId: string) => {
  try {
    const response = await axios.get(`/chat/adverts/${advertId}`);
    return {
      status: response.status,
      data: response.data.chatId, 
    };
  } catch (error) {
    console.error('Error fetching chat ID by advert ID:', error);
    throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};