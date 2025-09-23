import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/Auth/authSlice';
import callsReducer from '@/redux/features/Calls/callsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calls: callsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;