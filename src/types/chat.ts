import { Anuncio } from "./adverts";
import { SimpleUser } from "./user";

export interface Chat {
  _id: string;
  anuncio: Anuncio;
  owner: SimpleUser;
  user: SimpleUser;
  fechaCreacion: string;
  mensajes: ChatMessage[];
}
export interface ChatMessage {
  id: string;
  emisor: string;
  contenido: string;
  fechaEnvio: string;
}

export interface IChat {
  id?: string;
  advertId: string;
  ownerId: string;
  userId: string;
}
