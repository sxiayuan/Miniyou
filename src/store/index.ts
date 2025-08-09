import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import imageReducer from './slices/imageSlice';
import generationReducer from './slices/generationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    image: imageReducer,
    generation: generationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 