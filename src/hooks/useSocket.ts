import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';
import { API_BASE_URL } from '../config/environment';
import { ChatMessage } from '../types/chat';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export const initiateSocket = (room: string) => {
  socket = io(API_BASE_URL);
  if (socket && room) socket.emit('join', room);
}

export const disconnectSocket = () => {
  if(socket) socket.disconnect();
}

export const receiveMessage = (cb: (err: any, message: ChatMessage) => void) => {
  if (!socket) return(true);
  socket.on('receive_message', msg => {
    return cb(null, msg);
  });
}

export const sendMessage = (room: string, message: ChatMessage) => {
  if (socket) socket.emit('send_message', { message, room });
}
