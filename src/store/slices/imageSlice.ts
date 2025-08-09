import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageData, ProcessedImage } from '../../types';

interface ImageState {
  selectedImage: string | null;
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
  error: string | null;
}

const initialState: ImageState = {
  selectedImage: null,
  processedImage: null,
  isProcessing: false,
  error: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<string>) => {
      state.selectedImage = action.payload;
      state.error = null;
    },
    clearSelectedImage: (state) => {
      state.selectedImage = null;
      state.processedImage = null;
    },
    setProcessedImage: (state, action: PayloadAction<ProcessedImage>) => {
      state.processedImage = action.payload;
      state.isProcessing = false;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isProcessing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSelectedImage,
  clearSelectedImage,
  setProcessedImage,
  setProcessing,
  setError,
  clearError,
} = imageSlice.actions;

export default imageSlice.reducer; 