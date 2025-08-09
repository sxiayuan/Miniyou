import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    id: 'guest-' + Date.now(),
    isGuest: true,
    subscriptionTier: 'free',
    generationsUsed: 0,
    generationsLimit: 5,
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    setGuestUser: (state) => {
      state.user = {
        id: 'guest-' + Date.now(),
        isGuest: true,
        subscriptionTier: 'free',
        generationsUsed: 0,
        generationsLimit: 5,
      };
      state.error = null;
    },
    updateGenerationsUsed: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.generationsUsed = action.payload;
      }
    },
    upgradeToPremium: (state) => {
      if (state.user) {
        state.user.subscriptionTier = 'premium';
        state.user.generationsLimit = 999999; // Unlimited
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  setGuestUser,
  updateGenerationsUsed,
  upgradeToPremium,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer; 