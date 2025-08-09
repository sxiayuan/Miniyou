import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenerationResponse, StyleOption, ArtStyle } from '../../types';

interface GenerationState {
  currentGeneration: GenerationResponse | null;
  selectedStyle: StyleOption | null;
  isGenerating: boolean;
  progress: number;
  error: string | null;
  generationHistory: GenerationResponse[];
}

const initialState: GenerationState = {
  currentGeneration: null,
  selectedStyle: null,
  isGenerating: false,
  progress: 0,
  error: null,
  generationHistory: [],
};

const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    setSelectedStyle: (state, action: PayloadAction<StyleOption>) => {
      state.selectedStyle = action.payload;
      state.error = null;
    },
    startGeneration: (state, action: PayloadAction<GenerationResponse>) => {
      state.currentGeneration = action.payload;
      state.isGenerating = true;
      state.progress = 0;
      state.error = null;
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    completeGeneration: (state, action: PayloadAction<GenerationResponse>) => {
      state.currentGeneration = action.payload;
      state.isGenerating = false;
      state.progress = 100;
      state.generationHistory.unshift(action.payload);
      state.error = null;
    },
    failGeneration: (state, action: PayloadAction<string>) => {
      state.isGenerating = false;
      state.progress = 0;
      state.error = action.payload;
      if (state.currentGeneration) {
        state.currentGeneration.status = 'failed';
        state.currentGeneration.error = action.payload;
      }
    },
    cancelGeneration: (state) => {
      state.isGenerating = false;
      state.progress = 0;
      state.error = null;
    },
    clearGeneration: (state) => {
      state.currentGeneration = null;
      state.selectedStyle = null;
      state.isGenerating = false;
      state.progress = 0;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isGenerating = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSelectedStyle,
  startGeneration,
  updateProgress,
  completeGeneration,
  failGeneration,
  cancelGeneration,
  clearGeneration,
  setError,
  clearError,
} = generationSlice.actions;

export default generationSlice.reducer; 