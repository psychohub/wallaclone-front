import { ChatMessage } from "./chat";

export interface ServerToClientEvents {
  receive_message: (data: ChatMessage) => void;
}

export interface ClientToServerEvents {
  send_message: ({ message, room }: { message: ChatMessage, room: string }) => void;
	join: (room: string) => void;
}
