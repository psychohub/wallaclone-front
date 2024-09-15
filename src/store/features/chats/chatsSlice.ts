import { createSlice } from "@reduxjs/toolkit";
import { IChat } from "../../../types/chat";
import { SELECTED_CHAT } from "../../../config/environment";

type ChatsState = {
	selectedChat?: IChat
}

const selectedChat = localStorage.getItem(SELECTED_CHAT);

const initialState: ChatsState = {
  selectedChat: selectedChat ? JSON.parse(selectedChat) as IChat : undefined
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      localStorage.setItem(SELECTED_CHAT, JSON.stringify(action.payload));
    },
		resetSelectedChat: (state) => {
      state.selectedChat = initialState.selectedChat;
      localStorage.removeItem(SELECTED_CHAT);
    }
  }
});

export const { setSelectedChat, resetSelectedChat } = chatsSlice.actions;
export default chatsSlice.reducer;
