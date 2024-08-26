import { createSlice } from "@reduxjs/toolkit";

type TNotification = {
	text: string;
	variant: string;
	delay?: number;
};

type NotificationsState = {
	notifications: TNotification[]
}

const initialState: NotificationsState = {
  notifications: []
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
		resetNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addNotification, resetNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;