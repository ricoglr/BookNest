import { configureStore } from '@reduxjs/toolkit';
import kitapReducer from './kitapSlice'; 

export const store = configureStore({
  reducer: {
    kitaplar: kitapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
