import axios from '../lib/axiosInstance';

export const getChatMessages = async (chatId: string) => {
  try {
      const response = await axios.get(`/chat/${chatId}`);
      return {
          status: response.status,
          data: response.data
      };
  } catch (error) {
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


export const createChat = async (advertId: string) => {
  try {
    const response = await axios.post('/chat/create', { advertId });
    return {
      status: response.status,
      data: response.data.chatId,  
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el chat');
  }
};


