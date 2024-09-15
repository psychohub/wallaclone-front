import axios from '../lib/axiosInstance';

export const getOrCreateChat = async (advertId: string, ownerId: string, userId: string) => {
  try {
      const response = await axios.get(`/chats/messages/?advertId=${advertId}&ownerId=${ownerId}&userId=${userId}`);
      return {
          status: response.status,
          data: response.data.result
      };
  } catch (error) {
      throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};

export const saveChatMessage = async (chatId: string, content: string) => {
  try {
    const response = await axios.post('/chats', { chatId, contenido: content }); 
    return {
      status: response.status,
      data: response.data.newMessage
    };
  } catch (error) {
    throw new Error((error as any).response?.data as string ?? (error as Error).message);
  }
};

export const getAllMyChats = async () => {
  try {
    const response = await axios.get('/chats/');
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        status: 404,
        data: null,
      };
    }
    throw new Error(error.response?.data?.message || 'Error desconocido al obtener el chat');
  }
};
