import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import materialReducer from './materialSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    materials: materialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;