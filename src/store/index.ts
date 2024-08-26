import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import notificationsReducer from './features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
