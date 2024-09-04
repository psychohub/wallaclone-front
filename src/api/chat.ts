import axios from '../lib/axiosInstance';

export const getChatMessages = async (anuncioId: string) => {
  try {
    const response = await axios.get(`/chat/${anuncioId}`);  // Uso de ruta relativa
    return {
      status: response.status,
      data: response.data.mensajes
    };
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};

export const sendChatMessage = async (anuncioId: string, content: string) => {
  try {
    const response = await axios.post('/chat', { anuncioId, contenido: content });  // Uso de ruta relativa
    return {
      status: response.status,
      data: response.data.chat.mensajes[response.data.chat.mensajes.length - 1]
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};
